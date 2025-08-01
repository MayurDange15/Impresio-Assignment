const express = require("express");
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);

// IMPORTANT: Only admins can access these routes
router.use(authMiddleware.restrictTo("admin"));

router.get("/verifications", adminController.getPendingVerifications);
router.put("/verify/:id", adminController.processVerification);
router.get("/stats", adminController.getStats);

module.exports = router;
