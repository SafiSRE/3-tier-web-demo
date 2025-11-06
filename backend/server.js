import staticAssets from './static_assets.js';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import homestayRoutes from "./routes/homestayRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // NEW import

dotenv.config();
const app = express();
app.use(cors());
app.use(staticAssets);

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vista";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("Mongo connect error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/homestays", homestayRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes); // NEW: Register Admin Routes

app.get("/", (req, res) => res.send({status: "Vista Homestays API"}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("🚀 Server running on port", PORT));
