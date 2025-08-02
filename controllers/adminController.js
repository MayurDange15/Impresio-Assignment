const PartnerProfile = require("../models/partnerProfileModel");
const User = require("../models/userModel");
const Inquiry = require("../models/inquiryModel");
const Review = require("../models/reviewModel");
const Category = require("../models/categoryModel");
const Location = require("../models/locationModel");

// Admin: Get all pending verifications
exports.getPendingVerifications = async (req, res) => {
  try {
    const pendingPartners = await PartnerProfile.find({
      verificationStatus: "pending",
    }).populate("user", "email");

    res.status(200).json({
      status: "success",
      results: pendingPartners.length,
      data: {
        partners: pendingPartners,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Something went wrong." });
  }
};

exports.toggleFeaturedProfile = async (req, res) => {
  try {
    const profile = await PartnerProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({
        status: "fail",
        message: "No partner profile found with that ID",
      });
    }

    profile.featured = !profile.featured;
    await profile.save();

    res.status(200).json({
      status: "success",
      message: `Partner profile has been ${
        profile.featured ? "featured" : "unfeatured"
      }.`,
      data: {
        profile,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Generic Factory Functions for CRUD
const deleteOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res
        .status(404)
        .json({ status: "fail", message: "No document found with that ID" });
    }
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Something went wrong." });
  }
};

const updateOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return res
        .status(404)
        .json({ status: "fail", message: "No document found with that ID" });
    }
    res.status(200).json({ status: "success", data: { data: doc } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const createOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.create(req.body);
    res.status(201).json({ status: "success", data: { data: doc } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const getOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return res
        .status(404)
        .json({ status: "fail", message: "No document found with that ID" });
    }
    res.status(200).json({ status: "success", data: { data: doc } });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Something went wrong." });
  }
};

const getAll = (Model) => async (req, res) => {
  try {
    const docs = await Model.find();
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: { data: docs },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Something went wrong." });
  }
};

// Category and Location CRUD
exports.createCategory = createOne(Category);
exports.getCategory = getOne(Category);
exports.getAllCategories = getAll(Category);
exports.updateCategory = updateOne(Category);
exports.deleteCategory = deleteOne(Category);

exports.createLocation = createOne(Location);
exports.getLocation = getOne(Location);
exports.getAllLocations = getAll(Location);
exports.updateLocation = updateOne(Location);
exports.deleteLocation = deleteOne(Location);

// Reviews CRUD
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user", "email");
    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: { reviews },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Something went wrong." });
  }
};

exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate(
      "user",
      "email"
    );
    if (!review) {
      return res
        .status(404)
        .json({ status: "fail", message: "No review found with that ID" });
    }
    res.status(200).json({ status: "success", data: { review } });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Something went wrong." });
  }
};

exports.createReview = async (req, res) => {
  try {
    const newReview = await Review.create(req.body);
    res.status(201).json({ status: "success", data: { review: newReview } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!review) {
      return res
        .status(404)
        .json({ status: "fail", message: "No review found with that ID" });
    }
    res.status(200).json({ status: "success", data: { review } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res
        .status(404)
        .json({ status: "fail", message: "No review found with that ID" });
    }
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Something went wrong." });
  }
};

// Admin: Approve or reject a partner
exports.processVerification = async (req, res) => {
  try {
    const { status, comment } = req.body; // status should be 'verified' or 'rejected'

    if (!["verified", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid status provided." });
    }

    const updateData = { verificationStatus: status };
    if (status === "rejected") {
      updateData.rejectionComment = comment;
    }

    const partnerProfile = await PartnerProfile.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!partnerProfile) {
      return res.status(404).json({
        status: "fail",
        message: "No partner profile found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: `Partner has been ${status}.`,
      data: {
        partnerProfile,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Admin: Get high-level KPIs
exports.getStats = async (req, res) => {
  try {
    const totalClients = await User.countDocuments({ role: "client" });
    const totalPartners = await User.countDocuments({ role: "partner" });
    const pendingVerifications = await PartnerProfile.countDocuments({
      verificationStatus: "pending",
    });
    const totalInquiries = await Inquiry.countDocuments();

    res.status(200).json({
      status: "success",
      data: {
        stats: {
          totalClients,
          totalPartners,
          pendingVerifications,
          totalInquiries,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Something went wrong." });
  }
};
