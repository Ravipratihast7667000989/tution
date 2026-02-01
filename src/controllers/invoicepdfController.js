// const cloudinary = require('../config/cloudinary.js');
// const Pdf = require('../model/pdf_invoice_model.js');


// // ✅ Upload PDF
// exports.uploadPdf = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const stream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: "raw", // very important for pdf
//         folder: "pdf_files",
//       },
//       async (error, result) => {
//         if (error) {
//           return res.status(500).json({ error: error.message });
//         }

//         const saved = await Pdf.create({
//           title: req.body.title,
//           pdfUrl: result.secure_url,
//         });

//         res.status(200).json({
//           message: "PDF Uploaded Successfully",
//           data: saved,
//         });
//       }
//     );

//     stream.end(req.file.buffer);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// // ✅ Fetch All PDFs
// exports.getAllPdfs = async (req, res) => {
//   try {
//     const data = await Pdf.find().sort({ createdAt: -1 });
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// // download pdf cloudnary

// exports.downloadPdf = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // 1️⃣ Get record from MongoDB
//     const data = await Pdf.findById(id);
//     if (!data) {
//       return res.status(404).json({ error: "PDF not found" });
//     }

//     // 2️⃣ Generate Cloudinary download URL
//     const url = cloudinary.url(data.public_id, {
//       resource_type: 'raw',
//       secure: true,
//       attachment: true,   // ✅ forces download
//       format: 'pdf'
//     });

//     // 3️⃣ Redirect to Cloudinary download
//     return res.redirect(url);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
