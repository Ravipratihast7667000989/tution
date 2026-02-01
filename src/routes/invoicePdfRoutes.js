const express = require('express');
const multer = require('multer');
const router = express.Router();
const pdfController = require('../controllers/invoicepdfController.js');
const { downloadPdf } = require('../controllers/pdfController.js');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload-pdf', upload.single('pdf'), pdfController.uploadPdf);
router.get('/all-pdf', pdfController.getAllPdfs);
router.get('/download-pdf/:id', downloadPdf);

module.exports = router;
