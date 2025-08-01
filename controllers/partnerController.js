const PartnerProfile = require("../models/partnerProfileModel");

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
