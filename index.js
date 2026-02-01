// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Enable CORS
app.use(
  cors({
    origin: "*",
  })
);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

app.use("/api", require("./src/routes/userRoutes.js"));
// app.use("/api/auth", pdfRoutes);

// // Cron job: generate PDF every day at 9 AM
// cron.schedule("* * * * *", () => {
//   console.log("Generating daily PDF...");
//   generateAndSendPDF("ravipratihast69@gmail.com"); // Replace with recipient email
// });
app.listen(5000 ||process.env.PORT, () => console.log("Server running on port 5000"));
