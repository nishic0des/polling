import { io } from "socket.io-client";

const socket = io(
	process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") as string,
	{
		autoConnect: false,
	},
);
export default socket;
