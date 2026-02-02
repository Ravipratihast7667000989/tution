// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadet.js");
const auth = require("../controllers/userController.js");
const { getProfile } = require('../controllers/getProfile');
const authMiddleware = require('../middlewares/auth.middleware.js');

router.post("/register", upload.single("image"), auth.register);
router.get("/all-profile",auth.getAllUser);
router.post("/login", auth.login);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);
router.get("/profile/:id" , auth.getUser);
router.get('/profile', authMiddleware, getProfile);



module.exports = router;
