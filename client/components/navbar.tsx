"use client";
import Link from "next/link";
import ShinyText from "./ShinyText";

export default function Navbar() {
	return (
		<Link href="/">
			<div className="flex justify-center items-center pt-2">
				<div className="flex flex-row justify-center items-center h-15 w-md rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-20 ">
					<ShinyText
						text="POLLKHOLO"
						speed={2}
						delay={0}
						color="#b5b5b5"
						shineColor="#ffffff"
						spread={120}
						direction="left"
						yoyo={false}
						pauseOnHover={false}
						disabled={false}
						className="text-4xl font-bold "
					/>
				</div>
			</div>
		</Link>
	);
}
