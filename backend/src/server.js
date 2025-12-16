import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Public Routes
app.use("/api/auth", authRoute);

// Private Routes

// Connect DB
await connectDB();

app.listen(PORT, () => {
  console.log(`Server is opening on port ${PORT}`);
});
