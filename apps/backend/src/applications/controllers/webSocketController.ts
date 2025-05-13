import { Elysia } from "elysia";
import { createClient } from "redis";
import { redisLogs } from "@/infrastructures/redis/connection";
import { logService } from "@/config/dependencies";
import type { ElysiaWS } from "elysia/ws";
import { config } from "@/config/env";

const wsSessionMap = new Map<
  ElysiaWS,
  { subscriber: ReturnType<typeof createClient>; trainingId: string }
>();

export const webSocket = new Elysia({
  name: "web-socket-controller",
  prefix: "ws",
  detail: {
    tags: ["Web Socket"],
  },
})
  // .derive(({ request }) => userMiddleware(request))
  .decorate("logService", logService)
  .ws("/logs/:trainingId", {
    async open(ws) {
      const { trainingId } = ws.data.params;

      const subscriber = createClient({
        url: redisLogs.options?.url,
      });

      await subscriber.connect();
      await subscriber.subscribe(
        config.REDIS_LOG_CHANNEL,
        (message: string) => {
          const payload: { trainingId: string; data: string } =
            JSON.parse(message);
          if (payload.trainingId === trainingId) {
            ws.sendText(payload.data);
          }
        }
      );

      wsSessionMap.set(ws, { subscriber, trainingId });
    },

    async close(ws) {
      const session = wsSessionMap.get(ws);
      if (session) {
        await session.subscriber.unsubscribe(session.trainingId);
        await session.subscriber.quit();
        wsSessionMap.delete(ws);
      }
    },
  });
