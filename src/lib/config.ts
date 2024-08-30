import dotenv from "dotenv";
dotenv.config();

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
export const MONGO_URL = process.env.MONGO_URL || "";
