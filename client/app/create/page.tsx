"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Confetti from "@/components/ui/confetti";
import { toast } from "sonner";
import CreatePollSkeleton from "@/components/skeletons/create-poll-skeleton";

export default function CreatePollPage() {
	const router = useRouter();

	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState(["", ""]);
	const [loading, setLoading] = useState(false);
	const [confettiActive, setConfettiActive] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const createPoll = async () => {
		try {
			setLoading(true);
			const res = await api.post("/polls", {
				question,
				options,
			});
			if (!res.data.pollId) {
				toast.error("Failed to create poll :(", {
					duration: 5000,
					position: "top-center",
				});
				return;
			}
			if (res.status === 420) {
				setError("You're creating too many polls. Give yourself a break. <3");
			}
			toast.success("Poll created successfully!", {
				duration: 5000,
				position: "top-center",
			});
			setConfettiActive(true);

			// Turn off confetti after animation duration
			setTimeout(() => {
				setConfettiActive(false);
			}, 10000);

			router.push(`/poll/${res.data.pollId}`);
		} catch (error) {
			console.error("Error creating poll: ", error);
			toast.error("Failed to create poll :(", {
				duration: 5000,
				position: "top-center",
			});
		} finally {
			setLoading(false);
		}
	};

	const updateOption = (index: number, value: string) => {
		const newOptions = [...options];
		newOptions[index] = value;
		setOptions(newOptions);
	};

	if (loading) {
		return <CreatePollSkeleton />;
	}

	if (error) {
		return (
			<div className="max-w-xl mx-auto mt-10 space-y-4 text-red-600">
				<h1 className="text-2xl font-bold">Oops!</h1>
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div className="bg-gray-900 min-h-screen text-white">
			<Confetti isActive={confettiActive} duration={5000} />

			<div className="max-w-xl mx-auto pt-10 space-y-4">
				<h1 className="flex justify-center text-4xl font-bold">Create Poll</h1>
				<input
					className="w-full border p-2 bg-gray-700 rounded-2xl"
					placeholder="Enter question"
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
				/>
				<span className="p-2">Add options:</span>
				{options.map((opt, i) => (
					<input
						key={i}
						className="w-full border p-2 mt-4 bg-gray-700 rounded-2xl"
						placeholder={`Option ${i + 1}`}
						value={opt}
						onChange={(e) => updateOption(i, e.target.value)}
					/>
				))}
				<div className="flex justify-between">
					<button
						onClick={() => setOptions([...options, ""])}
						className="bg-gray-500 px-4 py-2 mt-2 rounded-2xl">
						Add Option
					</button>
					<button
						className="bg-blue-500 rounded-2xl text-white px-4 py-2"
						onClick={createPoll}
						disabled={loading}>
						{loading ? "Creating" : "Create Poll"}
					</button>
				</div>
			</div>
		</div>
	);
}
