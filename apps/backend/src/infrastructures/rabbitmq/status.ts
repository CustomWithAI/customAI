import { config } from "@/config/env";
import { queueLogger } from "@/config/logger";
import { formatSize } from "@/utils/size";

export async function fetchRabbitMQStats() {
  try {
    const response = await fetch("http://localhost:15672/api/nodes", {
      headers: {
        "Authorization": `Basic ${btoa(`${config.RABBITMQ_USER}:${config.RABBITMQ_PASSWORD}`)}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching RabbitMQ stats: ${response.statusText}`);
    }

    const data = await response.json();
    const nodeStats = data[0];

    return {
      diskFreeMB: formatSize(nodeStats.disk_free),
      diskUsedMB: formatSize(nodeStats.disk_free_limit - nodeStats.disk_free),
      memoryUsedMB: formatSize(nodeStats.mem_used),
      memoryLimitMB: formatSize(nodeStats.mem_limit),
      cpuUsage: nodeStats.cpu_usage ? `${(nodeStats.cpu_usage * 100).toFixed(2)}%` : "N/A"
    };
  } catch (error) {
    queueLogger.error("❌  Failed to fetch RabbitMQ stats:", error);
    return { error: (error as Error)?.message ?? "Unknown error" };
  }
}
