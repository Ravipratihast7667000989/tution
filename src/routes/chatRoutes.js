const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController.js');

router.get('/message', chatController.getAllMessages);

module.exports = router;
