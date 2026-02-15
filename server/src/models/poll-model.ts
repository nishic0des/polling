import mongoose, { Schema, Document } from "mongoose";

interface Option {
	optionId: string;
	text: string;
	votes: number;
}

export interface IPoll extends Document {
	pollId: string;
	question: string;
	options: Option[];
	createdAt: Date;
}

const OptionSchema = new Schema<Option>({
	optionId: { type: String, required: true },
	text: { type: String, required: true },
	votes: { type: Number, default: 0 },
});

const PollSchema = new Schema<IPoll>({
	pollId: { type: String, required: true, unique: true },
	question: { type: String, required: true },
	options: [OptionSchema],
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPoll>("Poll", PollSchema);
