import { formatSize } from "@/utils/size";
import { redis } from "./connection";

export async function getRedisStats() {
	try {
		const info = await redis.info();

		const stats: Record<string, string> = {};
		for (const line of info.split("\r\n")) {
			const [key, value] = line.split(":");
			if (key && value) {
				stats[key] = value;
			}
		}

		return {
			cpuUsage: stats.used_cpu_sys,
			memoryUsage: formatSize(stats.used_memory),
			storageSize: formatSize(stats.used_memory_dataset),
		};
	} catch (err) {
		console.error("❌  Failed to get Redis stats:", err);
		return null;
	}
}
