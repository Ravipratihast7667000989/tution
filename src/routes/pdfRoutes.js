const express = require("express");
const router = express.Router();
const { getAllPDFs } = require("../controllers/pdfController");
const upload = require("../middlewares/uploadet.js");


router.get("/pdf", upload.single("pdf"), getAllPDFs);

module.exports = router;
