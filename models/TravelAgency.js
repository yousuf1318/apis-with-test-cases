const mongoose = require("mongoose");

const TravelAgencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  travels: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: Number,
    required: true,
    unique: true,
  },
  gstin: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = TravelAgency = mongoose.model(
  "travelagency",
  TravelAgencySchema
);
