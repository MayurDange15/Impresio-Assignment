const mongoose = require("mongoose");

const portfolioItemSchema = new mongoose.Schema({
  partner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  imageUrl: {
    type: String,
    required: [true, "Portfolio item must have an image URL."],
  },
  description: {
    type: String,
    trim: true,
  },
  // This field is for reordering as requested
  orderIndex: {
    type: Number,
    default: 0,
  },
});

const PortfolioItem = mongoose.model("PortfolioItem", portfolioItemSchema);
module.exports = PortfolioItem;
