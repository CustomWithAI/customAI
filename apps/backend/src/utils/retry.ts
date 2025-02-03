import { logger } from "@/config/logger";
export async function retryConnection<T>(
	connectFn: () => Promise<T>,
	service: string,
	retries = 3,
	delay = 1000,
): Promise<T> {
	let attempt = 0;
	while (attempt < retries) {
		try {
			logger.info(
				`🔄 Attempting to connect to ${service} (try ${attempt + 1})`,
			);
			const result = await connectFn();
			logger.info(`✅ Connected to ${service}`);
			return result;
		} catch (error) {
			attempt++;
			logger.error(
				`❌ Failed to connect to ${service} (attempt ${attempt}/${retries})`,
				error,
			);
			if (attempt < retries) {
				await new Promise((res) => setTimeout(res, delay * 2 ** (attempt - 1)));
			} else {
				throw error;
			}
		}
	}
	throw new Error(`Failed to connect to ${service} after ${retries} attempts`);
}
