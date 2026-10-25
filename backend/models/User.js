const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: "USER" },
  age: { type: String, default: "" },
  gender: { type: String, default: "" },
  language: { type: String, default: "English" },
  country: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
