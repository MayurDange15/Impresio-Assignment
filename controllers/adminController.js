const PartnerProfile = require("../models/partnerProfileModel");
const User = require("../models/userModel");
const Inquiry = require("../models/inquiryModel");

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
