import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
	title: "Poll Kholo",
	description: "A real-time polling app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`antialiased bg-black`}>
				<LightRays
					raysOrigin="top-center"
					raysColor="#ffffff"
					raysSpeed={1}
					lightSpread={0.5}
					rayLength={5}
					followMouse={true}
					mouseInfluence={0.1}
					noiseAmount={0}
					distortion={0}
					className="custom-rays"
					pulsating={false}
					fadeDistance={3}
					saturation={1}
				/>
				<Navbar />
				{children}
				<Toaster />
			</body>
		</html>
	);
}
