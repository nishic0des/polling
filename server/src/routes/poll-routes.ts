import express from "express";
import {
	voteOnPoll,
	createPoll,
	getPoll,
} from "../controllers/poll-controller";
import { limitPollCreation, limitVotes } from "../middleware/rate-limiter";

const router = express.Router();

router.post("/", limitPollCreation, createPoll);
router.get("/:pollId", getPoll);

router.post("/:pollId/vote", limitVotes, voteOnPoll);

export default router;
