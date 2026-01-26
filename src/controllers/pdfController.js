const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary.js");
const Pdf = require("../model/Pdf_model.js");
const transporter = require("../config/mailConfig.js");

// Generate PDF as Buffer
const generatePDFBuffer = (content) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    doc.fontSize(24).text("Automatic PDF Generation", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(content);

    doc.end();
  });
};

// Upload PDF to Cloudinary
const uploadPDFToCloudinary = async (pdfBuffer) => {
  const tempPath = path.join(__dirname, `${Date.now()}.pdf`);
  fs.writeFileSync(tempPath, pdfBuffer);

  const result = await cloudinary.uploader.upload(tempPath, {
    resource_type: "raw",
    folder: "pdfs",
    public_id: Date.now().toString(),
  });

  fs.unlinkSync(tempPath);
  return result.secure_url;
};

// Send PDF via email
const sendPDFEmail = async (pdfBuffer, toEmail) => {
  const tempPath = path.join(__dirname, `${Date.now()}.pdf`);
  fs.writeFileSync(tempPath, pdfBuffer);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your Automatic PDF",
    text: "Please find the attached PDF.",
    attachments: [{ filename: "automatic.pdf", path: tempPath }],
  });

  fs.unlinkSync(tempPath);
};

// Generate, save, upload and email PDF
const generateAndSendPDF = async (toEmail) => {
  try {
    const content = `This PDF was automatically generated at ${new Date().toLocaleString()}`;
    const pdfBuffer = await generatePDFBuffer(content);

    // Upload to Cloudinary
    const cloudUrl = await uploadPDFToCloudinary(pdfBuffer);

    // Save to MongoDB
    const pdf = new Pdf({
      title: `PDF - ${new Date().toLocaleString()}`,
      url: cloudUrl,
    });
    await pdf.save();

    // Send email
    if (toEmail) await sendPDFEmail(pdfBuffer, toEmail);

    console.log("PDF generated, uploaded, and emailed:", cloudUrl);
  } catch (err) {
    console.error("Error generating PDF:", err);
  }
};

// Fetch all PDFs
const getAllPDFs = async (req, res) => {
  try {
    const pdfs = await Pdf.find().sort({ createdAt: -1 });
    res.json(pdfs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { generateAndSendPDF, getAllPDFs };
