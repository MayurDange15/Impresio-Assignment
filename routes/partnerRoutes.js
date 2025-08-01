const express = require("express");
const partnerController = require("../controllers/partnerController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);

// Only partners can access these routes
router.use(authMiddleware.restrictTo("partner"));

router.post("/profile", partnerController.submitProfile);
router.get("/leads", partnerController.getAssignedLeads);

// Portfolio Routes
router
  .route("/portfolio")
  .post(partnerController.addPortfolioItem)
  .get(partnerController.getPortfolio);

router
  .route("/portfolio/:id")
  .put(partnerController.updatePortfolioItem)
  .delete(partnerController.deletePortfolioItem);

module.exports = router;
