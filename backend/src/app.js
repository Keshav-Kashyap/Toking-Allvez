import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/users.routes.js";
import { connectToSocket } from "./controllers/socketManger.js";

const app = express();
const server = createServer(app);

// socket.io
connectToSocket(server);

// middlewares
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// routes
app.use("/api/v1/users", userRoutes);

app.get("/home", (req, res) => {
  return res.json({ hello: "world" });
});

// port
const PORT = process.env.PORT || 8000;

/**
 * 🔥 IMPORTANT FIX
 * Server will start FIRST
 * DB will connect AFTER
 */

// start server (THIS WAS THE BUG)
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// connect database
const start = async () => {
  try {
    const connectionDb = await mongoose.connect(
      "mongodb+srv://talkwithgamers:xj7EmWoKazvwDW6n@cluster0.v8a07ew.mongodb.net/"
    );
    console.log(
      `✅ MongoDB connected: ${connectionDb.connection.host}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};

start();
