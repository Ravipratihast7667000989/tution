// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {type: String,require: true},
  lastname:{type: String,require: true},
  phoneNumber:{type: String,require: true},
  email: { type: String, unique: true },
  password: {type: String,require: true},
  confirmPassword:{type: String,require: true},
  image: {type: String,require: true},
  studentId:{type: String , unique: true},
  dob: Date,
  otp: String,
  otpExpire: Date
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
