import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { trainingJobs, trainingLogs } from "./schema";
import { eq } from "drizzle-orm";
import amqp from "amqplib";
import { v4 as uuidv4 } from "uuid";

// Initialize database
const client = postgres(
  process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/ml_training"
);
const db = drizzle(client);

// Active WebSocket connections
type WebSocketConnection = {
  ws: any;
  modelId: string;
};
const activeConnections: WebSocketConnection[] = [];

// Connect to RabbitMQ
let rabbitmqChannel: amqp.Channel;
const QUEUE_NAME = "ml_training_queue";

async function setupRabbitMQ() {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost"
    );
    rabbitmqChannel = await connection.createChannel();
    await rabbitmqChannel.assertQueue(QUEUE_NAME, { durable: true });
    console.log("✅ RabbitMQ connected");
  } catch (error) {
    console.error("❌ Failed to connect to RabbitMQ:", error);
    process.exit(1);
  }
}

// Initialize the app
const app = new Elysia()
  .use(cors())
  .use(swagger())
  .onStart(async () => {
    await setupRabbitMQ();
  });

// Model validation schema
const TrainingConfigSchema = t.Object({
  type: t.String(),
  model: t.Object({
    n_estimators: t.Optional(t.Number()),
    max_depth: t.Optional(t.Number()),
    kernel: t.Optional(t.String()),
    C: t.Optional(t.Number()),
    n_neighbors: t.Optional(t.Number()),
  }),
  dataset: t.String(),
});

// API routes
app
  // Submit a new training job
  .post(
    "/api/training-jobs",
    async ({ body, set }) => {
      try {
        // Generate unique ID
        const modelId = uuidv4();

        // Store job in database
        const job = await db
          .insert(trainingJobs)
          .values({
            modelId,
            status: "queued",
            config: body,
          })
          .returning();

        // Queue the job in RabbitMQ
        await rabbitmqChannel.sendToQueue(
          QUEUE_NAME,
          Buffer.from(
            JSON.stringify({
              modelId,
              config: body,
            })
          ),
          { persistent: true }
        );

        console.log(`✅ Job queued: ${modelId}`);

        // Return the job details
        return {
          model_id: modelId,
          status: "queued",
          websocket_url: `/ws/${modelId}`,
        };
      } catch (error) {
        console.error("❌ Error submitting job:", error);
        set.status = 500;
        return { error: "Failed to submit training job" };
      }
    },
    { body: TrainingConfigSchema }
  )

  // Get job status
  .get("/api/training-jobs/:modelId", async ({ params, set }) => {
    try {
      const job = await db
        .select()
        .from(trainingJobs)
        .where(eq(trainingJobs.modelId, params.modelId))
        .limit(1);

      if (job.length === 0) {
        set.status = 404;
        return { error: "Job not found" };
      }

      return job[0];
    } catch (error) {
      set.status = 500;
      return { error: "Failed to retrieve job status" };
    }
  })

  // Get logs for a specific job
  .get("/api/training-jobs/:modelId/logs", async ({ params, set }) => {
    try {
      const logs = await db
        .select()
        .from(trainingLogs)
        .where(eq(trainingLogs.modelId, params.modelId))
        .orderBy(trainingLogs.timestamp);

      return { logs };
    } catch (error) {
      set.status = 500;
      return { error: "Failed to retrieve logs" };
    }
  })

  // Update job status
  .patch(
    "/api/training-jobs/:modelId/status",
    async ({ params, body, set }) => {
      try {
        const { status } = body;

        // Update job in database
        await db
          .update(trainingJobs)
          .set({
            status,
            updatedAt: new Date(),
            ...(status === "completed" ? { completedAt: new Date() } : {}),
          })
          .where(eq(trainingJobs.modelId, params.modelId));

        // Notify WebSocket clients
        const connections = activeConnections.filter(
          (conn) => conn.modelId === params.modelId
        );
        if (connections.length > 0) {
          const notification = {
            status,
            message: `Training job status changed to ${status}`,
            timestamp: new Date().toISOString(),
          };

          for (const conn of connections) {
            conn.ws.send(JSON.stringify(notification));
          }
        }

        return { success: true, status };
      } catch (error) {
        set.status = 500;
        return { error: "Failed to update job status" };
      }
    },
    {
      body: t.Object({
        status: t.String(),
      }),
    }
  )

  // WebSocket endpoint for both frontend and Python log sender
  .ws("/ws/:modelId", {
    async open(ws) {
      const { modelId } = ws.data.params;

      try {
        // Check if job exists
        const job = await db
          .select()
          .from(trainingJobs)
          .where(eq(trainingJobs.modelId, modelId))
          .limit(1);

        if (job.length === 0) {
          ws.close(1008, "Invalid model ID");
          return;
        }

        // Store connection
        activeConnections.push({ ws, modelId });

        console.log(`✅ WebSocket connected for model ${modelId}`);

        // Send existing logs to the client (if it's the frontend)
        const logs = await db
          .select()
          .from(trainingLogs)
          .where(eq(trainingLogs.modelId, modelId))
          .orderBy(trainingLogs.timestamp);

        for (const log of logs) {
          ws.send(
            JSON.stringify({
              level: log.level,
              message: log.message,
              timestamp: log.timestamp.toISOString(),
            })
          );
        }
      } catch (error) {
        console.error("❌ Error in WebSocket connection:", error);
        ws.close(1011, "Server error");
      }
    },

    // Message handler - for logs coming from Python
    async message(ws, message: any) {
      try {
        const { modelId } = ws.data.params;
        const logData = JSON.parse(message);

        // Add timestamp if not provided
        if (!logData.timestamp) {
          logData.timestamp = new Date();
        } else {
          logData.timestamp = new Date(logData.timestamp);
        }

        // Ensure modelId is consistent
        logData.modelId = modelId;

        // Store log in database
        await db.insert(trainingLogs).values({
          modelId,
          level: logData.level || "info",
          message: logData.message,
          timestamp: logData.timestamp,
        });

        // Forward log to all other WebSocket clients for this model
        const otherConnections = activeConnections.filter(
          (conn) => conn.modelId === modelId && conn.ws !== ws
        );

        for (const conn of otherConnections) {
          conn.ws.send(
            JSON.stringify({
              level: logData.level,
              message: logData.message,
              timestamp: logData.timestamp.toISOString(),
            })
          );
        }
      } catch (error) {
        console.error("❌ Error processing WebSocket message:", error);
      }
    },

    close(ws) {
      const { modelId } = ws.data.params;

      // Remove connection
      const index = activeConnections.findIndex((conn) => conn.ws === ws);
      if (index !== -1) {
        activeConnections.splice(index, 1);
      }

      console.log(`❌ WebSocket closed for model ${modelId}`);
    },
  });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Bun server running at http://localhost:${port}`);
});
