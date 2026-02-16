import { Skeleton } from "../ui/skeleton";

export default function CreatePollSkeleton() {
	return (
		<div className="bg-transparent min-h-screen text-white z-50">
			<div className="max-w-xl mx-auto pt-20 space-y-4">
				<div className="flex justify-between items-center mb-4">
					<Skeleton className="h-10 w-32" />
					<Skeleton className="h-10 w-10 rounded-2xl" />
				</div>
				<Skeleton className="w-full h-24 rounded-2xl" />
				<Skeleton className="w-full h-6 mb-4" />
				<Skeleton className="w-full h-12 rounded-2xl mb-2" />
				<Skeleton className="w-full h-12 rounded-2xl mb-2" />
				<Skeleton className="w-full h-12 rounded-2xl mb-2" />
				<div className="flex justify-between">
					<Skeleton className="p-2 rounded-2xl h-10 w-24" />
					<Skeleton className="p-2 bg-green-800 h-10 w-28" />
				</div>
			</div>
		</div>
	);
}
