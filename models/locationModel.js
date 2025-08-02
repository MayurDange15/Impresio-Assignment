const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A location must have a name."],
    unique: true,
  },
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
