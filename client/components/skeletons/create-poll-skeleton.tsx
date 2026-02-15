import { Skeleton } from "../ui/skeleton";

export default function CreatePollSkeleton() {
	return (
		<div className="max-w-xl mx-auto mt-10 space-y-4">
			<Skeleton className="h-8 w-32" />
			<Skeleton className="w-full border p-2 h-10" />
			<Skeleton className="w-full border p-2 h-10" />
			<Skeleton className="w-full border p-2 h-10" />
			<div className="flex gap-2">
				<Skeleton className="bg-gray-200 px-4 py-2 h-10 w-24" />
				<Skeleton className="bg-gray-200 px-4 py-2 h-10 w-28" />
			</div>
		</div>
	);
}
