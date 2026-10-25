// Simple seed script to create the admin account.
// Run once with: npm run seed
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URL, { dbName: process.env.DB_NAME });

  const email = (process.env.ADMIN_EMAIL || "admin@personlens.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "Admin";

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = "ADMIN";
    existing.password = await bcrypt.hash(password, 10);
    await existing.save();
    console.log("Admin account updated:", email);
  } else {
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, role: "ADMIN" });
    console.log("Admin account created:", email);
  }

  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.log(error);
  process.exit(1);
});
