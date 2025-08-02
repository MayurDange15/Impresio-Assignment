const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      email: req.body.email,
      password: req.body.password,
      role: req.body.role, // Roles: client, partner, admin
      otp: req.body.otp,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password, otp } = req.body;

  if (otp) {
    if (otp !== "123456") {
      return res.status(401).json({ status: "fail", message: "Incorrect OTP" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: "fail", message: "Incorrect email or password" });
    }
    const token = signToken(user._id);
    return res.status(200).json({
      status: "success",
      token,
    });
  }

  // Check if email and password exist
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "fail", message: "Please provide email and password!" });
  }

  // Check if user exists && password is correct
  const user = await User.findOne({ email }); // Find user by email

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res
      .status(401)
      .json({ status: "fail", message: "Incorrect email or password" });
  }

  // If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
};
