const express = require("express");
const inquiryController = require("../controllers/inquiryController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Only logged-in clients can create an inquiry
router.post(
  "/",
  authMiddleware.protect,
  authMiddleware.restrictTo("client"),
  inquiryController.createInquiry
);

module.exports = router;
