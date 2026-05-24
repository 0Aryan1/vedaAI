
import { app } from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(process.env.PORT || 3000, () => {
      console.log("Server running on port", process.env.PORT || 3000);
    });

    server.on("error", (error) => {
      console.error("Server error:", error);
      throw error;
    });

  } catch (error) {
    console.error("Server failed to start", error);
  }
};

startServer();
