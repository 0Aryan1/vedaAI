
import cors from "cors";
import express from "express";
import morgan from "morgan";
import type { Server } from "socket.io";
import assignmentRoutes from "./routes/assignment.routes";
import paperRoutes from "./routes/paper.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { ApiResponse } from "./utils/ApiResponse";

const app = express();

let _io: Server | undefined;

export const setIO = (io: Server): void => {
  _io = io;
};

export const getIO = (): Server => {
  if (!_io) {
    throw new Error("Socket.io server has not been initialized");
  }

  return _io;
};

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  return res.status(200).json(
    new ApiResponse(200, "Health check passed", {
      status: "ok",
      timestamp: new Date().toISOString(),
    })
  );
});

app.use("/api/assignments", assignmentRoutes);
app.use("/api/papers", paperRoutes);

app.use(errorHandler);

export default app;
