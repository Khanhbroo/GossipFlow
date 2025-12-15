import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(express.json());

// Connect DB
await connectDB();

app.listen(PORT, () => {
  console.log(`Server is opening on port ${PORT}`);
});
