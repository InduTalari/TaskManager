// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log("MONGO_URI:", process.env.MONGO_URI);


// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
