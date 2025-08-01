const Inquiry = require("../models/inquiryModel");
const PartnerProfile = require("../models/partnerProfileModel");

exports.createInquiry = async (req, res) => {
  try {
    const { category, eventDate, budget, city, referenceImageUrl } = req.body;

    // Find matching partners who are verified
    const matchedPartnerProfiles = await PartnerProfile.find({
      verificationStatus: "verified",
      city: city, // Match city
      categories: { $in: [category] }, // Match category
    });

    const matchedPartnerIds = matchedPartnerProfiles.map((p) => p.user);

    // Create the new inquiry
    const newInquiry = await Inquiry.create({
      client: req.user.id,
      category,
      eventDate,
      budget,
      city,
      referenceImageUrl,
      assignedPartners: matchedPartnerIds,
    });

    res.status(201).json({
      status: "success",
      message:
        "Inquiry submitted successfully! We will notify you when partners respond.",
      data: {
        inquiry: newInquiry,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
