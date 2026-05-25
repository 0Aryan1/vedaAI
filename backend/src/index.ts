
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app, { setIO } from "./app";
import connectDB from "./config/db";
import redis from "./config/redis";

const port = Number(process.env.PORT || 8000);
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
].filter(Boolean) as string[];

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

setIO(io);

void import("./workers/paper.worker").catch((error) => {
  console.error("Failed to initialize paper worker", error);
  process.exit(1);
});

io.on("connection", (socket) => {
  socket.on("join:job", (jobId: string) => {
    socket.join(jobId);
  });

  socket.on("disconnect", () => {});
});

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    httpServer.listen(port, () => {
      console.log(`VedaAI API listening on port ${port}`);
    });
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
};

const shutdown = async (signal: string): Promise<void> => {
  httpServer.close(async () => {
    await redis.quit();
    process.exit(0);
  });
};

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

void startServer();
