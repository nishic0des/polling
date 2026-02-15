import { RateLimiterRedis } from "rate-limiter-flexible";
import { NextFunction, Request, Response } from "express";
import { hashIp } from "../utils/hash-ip";
import { redisClient } from "../config/redis";

const voteLimiter = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: "voteLimiter",
	points: 5,
	duration: 60,
});

const createPollLimiter = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: "pollCreateLimiter",
	points: 3,
	duration: 600,
});

const getClientIp = (req: Request): string => {
	const forwarded = req.headers["x-forawrded-for"];
	if (typeof forwarded === "string") {
		return forwarded.split(",")[0].trim();
	}
	return req.socket.remoteAddress || "unknown";
};

export const limitVotes = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { pollId } = req.params;
		const hashedIp = hashIp(getClientIp(req));
		await voteLimiter.consume(`vote:${pollId}:${hashedIp}`);
		next();
	} catch (error: any) {
		if (error instanceof Error && error.name === "RateLimiterRedis") {
			return res.status(429).json({
				error: "Too many vote attempts. Please try later.",
			});
		}
		console.error("Rate limiter error: ", error);
		next();
	}
};

export const limitPollCreation = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const hashedIp = hashIp(getClientIp(req));
		await createPollLimiter.consume(hashedIp);
		next();
	} catch (error) {
		return res.status(429).json({
			error: "Too many polls created. Please try again later",
		});
	}
};
