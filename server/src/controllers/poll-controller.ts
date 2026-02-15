import { Request, Response } from "express";
import Poll from "../models/poll-model";
import Vote from "../models/vote-model";
import { hashIp } from "../utils/hash-ip";
import { io } from "../index";
import { v4 as uuid } from "uuid";
import mongoose from "mongoose";

export const createPoll = async (req: Request, res: Response) => {
	try {
		let { question, options } = req.body;

		if (!question || !Array.isArray(options)) {
			return res.status(400).json({ error: "Invalid data format" });
		}

		question = question.trim();

		if (question.length == 0 || question.length > 200) {
			return res.status(400).json({ error: "Question length is invalid" });
		}

		const cleanedOpts = options
			.map((opt: string) => opt.trim())
			.filter((opt: string) => opt.length > 0);

		const uniqueOpts = Array.from(
			new Map(
				cleanedOpts.map((opt: string) => [opt.toLowerCase(), opt]),
			).values(),
		);

		if (uniqueOpts.length < 2) {
			return res
				.status(400)
				.json({ error: "At least two unique options are required." });
		}

		if (uniqueOpts.length > 10) {
			return res
				.status(400)
				.json({ error: "A maximum of 10 options are allowed" });
		}

		const pollId = uuid();

		const formattedOpts = uniqueOpts.map((opt) => ({
			optionId: uuid(),
			text: opt,
			votes: 0,
		}));

		await Poll.create({
			pollId,
			question,
			options: formattedOpts,
		});

		return res.status(201).json({ pollId });
	} catch (error) {
		console.error("Error creating poll: ", error);
		return res
			.status(500)
			.json({ error: "Failed to create poll. Please try later." });
	}
};

export const getPoll = async (req: Request, res: Response) => {
	try {
		const { pollId } = req.params;

		const poll = await Poll.findOne({ pollId }).select("-_id -__v");

		if (!poll) {
			return res.status(404).json({ error: "Poll not found" });
		}

		return res.status(200).json(poll);
	} catch (error) {
		console.error("Error fetching poll: ", error);

		return res.status(500).json({ error: "Internal server error" });
	}
};

export const voteOnPoll = async (req: Request, res: Response) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { pollId } = req.params;
		const { optionId, fingerprint } = req.body;

		// Ensure pollId is a string, not an array
		const pollIdStr = Array.isArray(pollId) ? pollId[0] : pollId;

		if (!optionId || !fingerprint) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		const poll = await Poll.findOne({ pollId: pollIdStr }).session(session);

		if (!poll) {
			await session.abortTransaction();
			return res.status(404).json({ error: "Poll not found" });
		}

		const optionExists = poll.options.some((opt) => opt.optionId === optionId);

		if (!optionExists) {
			await session.abortTransaction();

			return res.status(400).json({ error: "Invalid option" });
		}

		const rawIp =
			(req.headers["x-forwarded-for"] as string) ||
			req.socket.remoteAddress ||
			"";
		const ipHash = hashIp(rawIp);

		await Vote.create(
			[
				{
					pollId: pollIdStr,
					ipHash,
					fingerprint,
				},
			],
			{ session },
		);

		await Poll.updateOne(
			{ pollId: pollIdStr, "options.optionId": optionId },
			{ $inc: { "options.$.votes": 1 } },
			{ session },
		);

		await session.commitTransaction();
		session.endSession();

		const updatedPoll = await Poll.findOne({ pollId: pollIdStr }).lean();
		console.log("Emitting update to room:", pollIdStr);

		io.to(pollIdStr).emit("resultsUpdated", updatedPoll);

		return res.status(200).json(updatedPoll);
	} catch (error: any) {
		if (error.code === 110000) {
			return res
				.status(400)
				.json({ error: "You have already voted on this poll" });
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};
