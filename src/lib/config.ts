import dotenv from "dotenv";
dotenv.config();

export const API_KEY = process.env.API_KEY || "";
export const MONGO_URL = process.env.MONGO_URL || "";
