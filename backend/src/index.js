/*import dotenv from "dotenv";
import connectDB from "./db/database.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

// ✅ Connect to MongoDB once (outside handler)
await connectDB().catch((err) => {
  console.error("❌ MongoDB connection failed:", err);
});

// ✅ Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Express backend is live on Vercel (serverless)"
  });
});

// ✅ Export the app instead of listening (important!)
export default app;
*/
import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})
import connectDB from "./db/database.js";
import { app } from "./app.js";





connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`⚙️ Server is running at port: ${port}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use. Try a different port.`);
      } else {
        console.error('❌ Listen error:', err);
      }
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error("❌ MONGO DB connection failed:", err);
    process.exit(1);
  });
