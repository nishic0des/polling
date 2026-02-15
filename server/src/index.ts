import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { connectDB } from "./config/db";
import pollRoutes from "./routes/poll-routes";
import helmet from "helmet";
import { errorHandler } from "./middleware/error-handler";
import { createAdapter } from "@socket.io/redis-adapter";
import { redisClient } from "./config/redis";
import Redis from "ioredis";

dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB();

// Middleware
app.use(express.json({ limit: "10kb" }));
app.use(
	cors({
		// origin: process.env.CLIENT_URL,
		// credentials: true,
		origin: "*",
	}),
);
app.use(helmet);
app.use(errorHandler);

app.set("trust proxy", 1);

app.use("/api/polls", pollRoutes);

// Socket.io Setup
export const io = new Server(server, {
	cors: {
		origin: process.env.CLIENT_URL,
		methods: ["GET", "POST"],
		credentials: true,
	},
});

const pubClient = new Redis(process.env.REDIS_URL as string);
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

io.on("connection", (socket) => {
	console.log("User connected:", socket.id);

	socket.on("joinPoll", (pollId: string) => {
		console.log("Socket joined room:", pollId);

		socket.join(pollId);

		const room = io.sockets.adapter.rooms.get(pollId);
		const count = room ? room.size : 0;

		io.to(pollId).emit("viewerCount", count);
	});

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
		for (const room of socket.rooms) {
			if (room !== socket.id) {
				const roomData = io.sockets.adapter.rooms.get(room);
				const count = roomData ? roomData.size - 1 : 0;
				io.to(room).emit("viewerCount", count);
			}
		}
	});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
