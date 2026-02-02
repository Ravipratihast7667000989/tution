// controllers/auth.controller.js
const User = require("../model/usermodels.js");
const bcrypt = require("bcryptjs");
const { name } = require("ejs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const generateStudentId = require("../utils/generateStudentId.js");
const Student = require("../model/counter_model.js");



/* REGISTER */
exports.register = async (req, res) => {
  const { firstname,lastname,phoneNumber,email ,password } = req.body;
  const studentId = await generateStudentId();


  const existingUser = await User.findOne({ email });

if (existingUser) {
  return res.status(409).json({
    message: "Email already registered"
  });
}

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstname,
    lastname,
    phoneNumber,
    email,
    password: hashedPassword,
    image: req.file ? req.file.path : null,
    studentId,


  });

  // res.json({ message: "Registered successfully" });
  res.status(200).json({
  success: true,
  message: "Register success"
});

};


// 🔹 Fetch user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 Fetch all user
exports.getAllUser = async (req, res) => {
  try {
    const user = await User.find();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGIN */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, name:user.name,image:user.image}, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });
  res.status(200).json({status:true,token:token});

  // res.json({ token, user });
};

/* SEND OTP */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  user.otp = otp;
  user.otpExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}`
  });

  res.json({ message: "OTP sent to email" });
};

/* VERIFY OTP & CHANGE PASSWORD */
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp != otp || user.otpExpire < Date.now()) {
    return res.status(400).json({ msg: "Invalid or expired OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpire = null;
  await user.save();

  res.json({ message: "Password changed successfully" });
};


