import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./config/db.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import friendRoute from "./routes/friendRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Public Routes
app.use("/api/auth", authRoute);

// Private Routes
app.use(protectedRoute);
app.use("/api/user", userRoute);
app.use("/api/friend", friendRoute);

// Connect DB
await connectDB();

app.listen(PORT, () => {
  console.log(`Server is opening on port ${PORT}`);
});
