const mongoose = require("mongoose");

const partnerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  city: {
    type: String,
    trim: true,
  },
  categories: {
    type: [String], // An array of strings like ['wedding', 'maternity']
  },
  serviceDetails: {
    type: String,
    required: [true, "Please provide your service details."],
  },
  documentMetadata: {
    aadharNumber: {
      type: String,
      required: [true, "Aadhar number is required."],
    },
  },
  portfolioUrl: {
    type: String,
    required: [true, "Please provide a portfolio URL."],
  },
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  rejectionComment: {
    type: String,
  },
  featured: {
    type: Boolean,
    default: false,
  },
});

// So a user can only have one profile
partnerProfileSchema.index({ user: 1 }, { unique: true });

const PartnerProfile = mongoose.model("PartnerProfile", partnerProfileSchema);
module.exports = PartnerProfile;
