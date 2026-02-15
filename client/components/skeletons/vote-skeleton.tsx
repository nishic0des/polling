import { Skeleton } from "../ui/skeleton";

export default function VoteSkeleton() {
	return (
		<div className="bg-slate-900 text-white min-h-screen">
			<div className="max-w-xl mx-auto pt-10 space-y-4 py-10">
				<Skeleton className="h-8 w-3/4 bg-gray-600" />
				<div className="border-2 border-gray-200 rounded-2xl p-4">
					<div className="space-y-1 py-3">
						<div className="flex justify-between">
							<Skeleton className="h-4 w-32 bg-gray-600" />
							<Skeleton className="h-4 w-12 bg-gray-600" />
						</div>
						<Skeleton className="h-2 w-full bg-white/20" />
						<Skeleton className="mt-2 h-8 w-16 bg-gray-500" />
					</div>
					<div className="space-y-1 py-3">
						<div className="flex justify-between">
							<Skeleton className="h-4 w-32 bg-gray-600" />
							<Skeleton className="h-4 w-12 bg-gray-600" />
						</div>
						<Skeleton className="h-2 w-full bg-white/20" />
						<Skeleton className="mt-2 h-8 w-16 bg-gray-500" />
					</div>
					<div className="space-y-1 py-3">
						<div className="flex justify-between">
							<Skeleton className="h-4 w-32 bg-gray-600" />
							<Skeleton className="h-4 w-12 bg-gray-600" />
						</div>
						<Skeleton className="h-2 w-full bg-white/20" />
						<Skeleton className="mt-2 h-8 w-16 bg-gray-500" />
					</div>
				</div>
				<Skeleton className="flex justify-center items-center pt-10 h-8 w-64 bg-gray-600" />
				<div className="flex gap-2">
					<Skeleton className="border p-2 flex-1 rounded-lg h-10 bg-gray-700" />
					<Skeleton className="h-10 w-10 bg-gray-500" />
				</div>
			</div>
		</div>
	);
}
