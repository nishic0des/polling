import Link from "next/link";

export default function Home() {
	return (
		<div className="bg-gray-900 min-h-screen flex items-center justify-center">
			<div className="flex flex-col items-center justify-center text-center">
				<h1 className="text-6xl text-white font-bold mb-4">POLL KHOL</h1>
				<span className="text-white text-lg">A real-time polling app</span>
				<Link
					href="/create"
					className="text-white mt-10 border-2 p-2 rounded-2xl bg-gray-700">
					Create your own polls
				</Link>
			</div>
		</div>
	);
}
