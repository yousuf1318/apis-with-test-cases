const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  from: {
    type: String,
    required: "true",
  },
  to: {
    type: String,
    required: "true",
  },
  busModel: {
    type: String,
    required: "true",
  },
  departureTime: {
    type: String,
    required: "true",
  },
  arrivalTime: {
    type: String,
    required: "true",
  },
  fare: {
    type: Number,
    required: "true",
  },
});

module.exports = Bus = mongoose.model("bus", BusSchema);
