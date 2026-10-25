
const dns = require("node:dns");

// Configure DNS before connecting to MongoDB Atlas
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const personalityRoutes = require("./routes/personality");
const voiceRoutes = require("./routes/voice");
const dashboardRoutes = require("./routes/dashboard");
const reportRoutes = require("./routes/reports");
const profileRoutes = require("./routes/profile");
const adminRoutes = require("./routes/admin");
const feedbackRoutes = require("./routes/feedback");
const notificationRoutes = require("./routes/notifications");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/personality", personalityRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);

// API Health Check
app.get("/api", (req, res) => {
  res.json({ message: "PersonLens API is running" });
});

// Server Configuration
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

// Validate MongoDB configuration
if (!MONGO_URL) {
  console.error("Error: MONGO_URL is missing from the .env file");
  process.exit(1);
}

// Connect to MongoDB Atlas
mongoose
  .connect(MONGO_URL, {
    ...(DB_NAME ? { dbName: DB_NAME } : {}),
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`PersonLens server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });
