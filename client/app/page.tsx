"use client";
import SplitText from "@/components/SplitText";
import RotatingText from "@/components/RotatingText";
import Link from "next/link";
export default function Home() {
	return (
		<div className="bg-transparent min-h-screen flex flex-col items-center justify-center relative z-50">
			<SplitText
				text="POLL KHOLO"
				className="text-8xl font-bold text-white relative z-50 mb-8"
				delay={100}
				duration={2}
				ease="power3.out"
				splitType="chars"
				from={{ opacity: 0, y: 50 }}
				to={{ opacity: 1, y: 0 }}
				threshold={0.5}
				rootMargin="0px"
				textAlign="center"
			/>
			<div className="flex items-center gap-4 mb-8">
				<h1 className="text-3xl font-semibold text-white relative z-50">
					Real-time
				</h1>
				<RotatingText
					texts={["Polls", "Votes", "Results", "Insights", "Engagement"]}
					mainClassName="px-2 sm:px-2 md:px-3 bg-transparent text-white border-2 text-2xl font-bold overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg relative z-50"
					staggerFrom={"last"}
					initial={{ y: "100%" }}
					animate={{ y: 0 }}
					exit={{ y: "-120%" }}
					staggerDuration={0.025}
					splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
					transition={{ type: "spring", damping: 30, stiffness: 400 }}
					rotationInterval={2000}
				/>
			</div>
			<Link
				href="/create"
				className="text-2xl font-bold text-white relative z-50 mt-10 bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors border-2 border-gray-300">
				Get started
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M13 7l5 5m0 0l-5 5m5-5H6"
					/>
				</svg>
			</Link>
		</div>
	);
}
