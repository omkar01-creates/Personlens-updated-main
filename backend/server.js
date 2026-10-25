const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

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

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Routes (all prefixed with /api)
app.use("/api/auth", authRoutes);
app.use("/api/personality", personalityRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "PersonLens API is running" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL, { dbName: process.env.DB_NAME })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });
