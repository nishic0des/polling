import mongoose, { Schema, Document } from "mongoose";

export interface IVote extends Document {
	pollId: string;
	ipHash: string;
	fingerprint: string;
	votedAt: Date;
}

const VoteSchema = new Schema<IVote>({
	pollId: { type: String, required: true },
	ipHash: { type: String, required: true },
	fingerprint: { type: String, required: true },
	votedAt: { type: Date, default: Date.now },
});

VoteSchema.index({ pollId: 1, ipHash: 1 }, { unique: true });
VoteSchema.index({ pollId: 1, fingerprint: 1 }, { unique: true });

export default mongoose.model<IVote>("Vote", VoteSchema);
