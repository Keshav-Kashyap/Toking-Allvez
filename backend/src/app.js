import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/users.routes.js";
import { connectToSocket } from "./controllers/socketManger.js";

const app = express();
const server = createServer(app);

// socket
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

// 🔥 SERVER FIRST
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// 🔥 DB OPTIONAL (NON-BLOCKING)
(async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://keshav:%40Keshav981101@cluster0.havrjwt.mongodb.net/tokingdb"
    );
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("⚠️ MongoDB NOT connected (server still running)");
  }
})();
