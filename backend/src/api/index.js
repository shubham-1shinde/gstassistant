/*import serverless from "serverless-http";
import dotenv from "dotenv";
import connectDB from "../db/database.js";
import { app } from "../app.js";

dotenv.config({ path: './.env' });

// Ensure MongoDB connection (cached across invocations)
let isConnected = false;
async function ensureDBConnection() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log("✅ MongoDB connected (Vercel)");
  }
}

app.use(async (req, res, next) => {
  await ensureDBConnection();
  next();
});

// ✅ Default export — REQUIRED by Vercel
export default serverless(app);
*/