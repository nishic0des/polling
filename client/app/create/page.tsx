"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Confetti from "@/components/ui/confetti";
import { toast } from "sonner";
import CreatePollSkeleton from "@/components/skeletons/create-poll-skeleton";
import { DeleteIcon, RotateCcw, Plus } from "lucide-react";

export default function CreatePollPage() {
	const router = useRouter();

	const [question, setQuestion] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("poll-question") || "";
		}
		return "";
	});
	const [options, setOptions] = useState(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("poll-options");
			return saved ? JSON.parse(saved) : ["", ""];
		}
		return ["", ""];
	});
	const [loading, setLoading] = useState(false);
	const [confettiActive, setConfettiActive] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("poll-question", question);
		}
	}, [question]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("poll-options", JSON.stringify(options));
		}
	}, [options]);
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

			if (typeof window !== "undefined") {
				localStorage.removeItem("poll-question");
				localStorage.removeItem("poll-options");
			}

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

	const reset = () => {
		setQuestion("");
		setOptions(["", ""]);
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
		<div className="bg-transparent min-h-screen text-white z-50">
			<Confetti isActive={confettiActive} duration={5000} />

			<div className="max-w-xl mx-auto pt-20 space-y-4">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-4xl text-white font-bold z-50">Open a Poll</h1>
					<button
						onClick={reset}
						className="bg-slate-700 text-white px-4 py-2.5 rounded-2xl hover:bg-gray-600 transition-colors">
						<RotateCcw height={20} width={20} />
					</button>
				</div>
				<textarea
					cols={50}
					rows={5}
					className="w-full p-3 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-20 border border-gray-100"
					placeholder="Enter question"
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
				/>
				<span className="font-bold block mb-4">Add options:</span>
				{options.map((opt: number, i: number) => (
					<div key={i} className="flex gap-2">
						<input
							className="flex-1 p-3 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-20 border border-gray-100"
							placeholder={`Option ${i + 1}`}
							value={opt}
							onChange={(e) => updateOption(i, e.target.value)}
						/>
						{options.length > 2 && (
							<button
								onClick={() => {
									const newOptions = options.filter(
										(_: number, index: number) => index !== i,
									);
									setOptions(newOptions);
								}}
								className="bg-red-500 text-white px-4 py-2.5 rounded-2xl hover:bg-red-600 transition-colors">
								<DeleteIcon height={20} width={20} />
							</button>
						)}
					</div>
				))}
				<div className="flex justify-between">
					<button
						onClick={() => setOptions([...options, ""])}
						className="p-2 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-20 border border-gray-100">
						<div className="flex flex-row text-md">
							<Plus />
							{"Add Option"}
						</div>
					</button>
					<button
						className="p-2 bg-green-200 text-black text-md rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 border border-gray-300"
						onClick={createPoll}
						disabled={loading}>
						{loading ? "Creating" : "Create Poll"}
					</button>
				</div>
			</div>
		</div>
	);
}
