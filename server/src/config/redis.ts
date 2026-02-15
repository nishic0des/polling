import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redisClient = new Redis(process.env.REDIS_URL as string, {
	maxRetriesPerRequest: 3,
	enableReadyCheck: true,
});

redisClient.on("connect", () => {
	console.log("Redis connected");
});

redisClient.on("error", (error) => {
	console.error("Redis error: ", error);
});
