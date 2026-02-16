/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import socket from "@/lib/sockets";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Field, FieldLabel } from "@/components/ui/field";
import Confetti from "@/components/ui/confetti";
import { Copy } from "lucide-react";
import Link from "next/link";
import VoteSkeleton from "@/components/skeletons/vote-skeleton";
interface Option {
	optionId: string;
	text: string;
	votes: number;
}

interface Poll {
	pollId: string;
	question: string;
	options: Option[];
}

export default function PollPage() {
	const { pollId } = useParams() as { pollId: string };

	const [poll, setPoll] = useState<Poll | null>(null);
	const [hasVoted, setHasVoted] = useState(false);
	const [confettiActive, setConfettiActive] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		socket.connect();
		socket.emit("joinPoll", pollId);

		const fetchPoll = async () => {
			try {
				const res = await api.get(`/polls/${pollId}`);
				setPoll(res.data);

				const voted = localStorage.getItem(`voted-${pollId}`);
				if (voted) setHasVoted(true);
			} catch {
				toast.error("Poll not found :(", {
					duration: 5000,
					position: "top-center",
				});
			}
		};

		fetchPoll();

		socket.on("resultsUpdated", (updatedPoll: Poll) => {
			setPoll(updatedPoll);
		});

		return () => {
			socket.disconnect();
		};
	}, [pollId]);

	const handleVote = async (optionId: string) => {
		try {
			const fingerprint = getFingerprint();

			if (hasVoted) {
				toast.warning("You have voted already :/");
			}

			const res = await api.post(`/polls/${pollId}/vote`, {
				optionId,
				fingerprint,
			});

			if (res.status === 420) {
				setError("You've been voting too much. Take a break. <3");
			}

			localStorage.setItem(`voted-${pollId}`, "true");
			setHasVoted(true);
			setConfettiActive(true);

				setTimeout(() => {
				setConfettiActive(false);
			}, 5000);

			toast.success("You have voted successfully! :)", {
				duration: 5000,
				position: "top-center",
			});
		} catch (error: any) {
			console.error("Failed to register vote: ", error);

			toast.error("Failed to register your vote :(", {
				duration: 5000,
				position: "top-center",
			});
		}
	};

	const getFingerprint = () => {
		let id = localStorage.getItem("device-id");
		if (!id) {
			id = crypto.randomUUID();
			localStorage.setItem("device-id", id);
		}
		return id;
	};

	if (!poll) return <VoteSkeleton />;

	if (error) {
		return (
			<div className="max-w-xl mx-auto mt-10 space-y-4 text-red-600">
				<h1 className="text-2xl font-bold">Oops!</h1>
				<p>{error}</p>
			</div>
		);
	}

	const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

	return (
		<div className="bg-transparent text-white min-h-screen">
			<Confetti isActive={confettiActive} duration={5000} />

			<div className="max-w-xl mx-auto pt-10 space-y-4 py-10">
				<h1 className="text-2xl font-bold">{poll.question}</h1>
				<div className="border-2 border-gray-200 rounded-2xl p-4">
					{poll.options.map((opt) => {
						const percentage = totalVotes
							? ((opt.votes / totalVotes) * 100).toFixed(2)
							: "0";
						return (
							<div key={opt.optionId} className="space-y-1 py-3">
								<Field>
									<FieldLabel className="flex justify-between">
										<span>
											{opt.text} ({opt.votes})
										</span>
										<span>{percentage}%</span>
									</FieldLabel>
									<Progress
										value={Number(percentage)}
										className="bg-white/20"
									/>
								</Field>

								{!hasVoted && (
									<button
										onClick={() => handleVote(opt.optionId)}
										className="mt-2 bg-blue-500 text-white px-3 py-1">
										Vote
									</button>
								)}
							</div>
						);
					})}
				</div>
				<h2 className="pt-10 text-center text-2xl font-bold">
					Share the poll with your friends!
				</h2>
				<div className="flex gap-2">
					<input
						readOnly
						value={window.location.href}
						className="border p-2 flex-1 rounded-lg"
					/>
					<button
						onClick={() => {
							navigator.clipboard.writeText(window.location.href);
							toast.success("Link copied to clipboard!", {
								duration: 5000,
								position: "top-center",
							});
						}}
						className="bg-green-500 text-white px-3 rounded-lg">
						<Copy height={20} width={20} />
					</button>
				</div>

				<div className="flex justify-center">
					<Link
						href="/create"
						className="flex justify-center items-center border-2 w-fit text-center text-white px-3 rounded-2xl mt-3 py-1">
						Click here to create your own polls!
					</Link>
				</div>
			</div>
		</div>
	);
}
