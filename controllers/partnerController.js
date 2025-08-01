const PartnerProfile = require("../models/partnerProfileModel");
const PortfolioItem = require("../models/portfolioItemModel");

exports.submitProfile = async (req, res) => {
  try {
    const { serviceDetails, aadharNumber, portfolioUrl } = req.body;

    // Check if a profile already exists for this user
    const existingProfile = await PartnerProfile.findOne({ user: req.user.id });
    if (existingProfile) {
      return res.status(400).json({
        status: "fail",
        message: "You have already submitted a profile for verification.",
      });
    }

    const newProfile = await PartnerProfile.create({
      user: req.user.id,
      serviceDetails,
      documentMetadata: { aadharNumber },
      portfolioUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Profile submitted for verification successfully.",
      data: {
        profile: newProfile,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAssignedLeads = async (req, res) => {
  try {
    // Find inquiries where the logged-in partner's ID is in the 'assignedPartners' array
    const leads = await Inquiry.find({
      assignedPartners: req.user.id,
    }).populate("client", "email");

    res.status(200).json({
      status: "success",
      results: leads.length,
      data: {
        leads,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

exports.addPortfolioItem = async (req, res) => {
  try {
    const { imageUrl, description, orderIndex } = req.body;
    const newItem = await PortfolioItem.create({
      partner: req.user.id,
      imageUrl,
      description,
      orderIndex,
    });
    res.status(201).json({ status: "success", data: { item: newItem } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const items = await PortfolioItem.find({ partner: req.user.id }).sort(
      "orderIndex"
    );
    res
      .status(200)
      .json({ status: "success", results: items.length, data: { items } });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

exports.updatePortfolioItem = async (req, res) => {
  try {
    const item = await PortfolioItem.findOneAndUpdate(
      { _id: req.params.id, partner: req.user.id }, // Ensure partner can only update their own items
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "No item found with that ID for the current user.",
      });
    }
    res.status(200).json({ status: "success", data: { item } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deletePortfolioItem = async (req, res) => {
  try {
    const item = await PortfolioItem.findOneAndDelete({
      _id: req.params.id,
      partner: req.user.id,
    });
    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "No item found with that ID for the current user.",
      });
    }
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};
