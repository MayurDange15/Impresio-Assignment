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

// Review management
router
  .route("/reviews")
  .get(adminController.getAllReviews)
  .post(adminController.createReview);

router
  .route("/reviews/:id")
  .get(adminController.getReview)
  .put(adminController.updateReview)
  .delete(adminController.deleteReview);

// Category management
router
  .route("/categories")
  .get(adminController.getAllCategories)
  .post(adminController.createCategory);

router
  .route("/categories/:id")
  .get(adminController.getCategory)
  .put(adminController.updateCategory)
  .delete(adminController.deleteCategory);

// Location management
router
  .route("/locations")
  .get(adminController.getAllLocations)
  .post(adminController.createLocation);

router
  .route("/locations/:id")
  .get(adminController.getLocation)
  .put(adminController.updateLocation)
  .delete(adminController.deleteLocation);

// Feature a partner profile
router.put("/profiles/:id/feature", adminController.toggleFeaturedProfile);

module.exports = router;
