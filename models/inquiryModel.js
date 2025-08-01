// /models/inquiryModel.js
const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: [true, "An inquiry must have a category."],
    },
    eventDate: {
      type: Date,
    },
    budget: {
      type: Number,
    },
    city: {
      type: String,
      required: [true, "An inquiry must have a city."],
    },
    referenceImageUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["new", "responded", "booked", "closed"],
      default: "new",
    },
    // This field will store partners who are matched with this lead
    assignedPartners: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);
module.exports = Inquiry;
