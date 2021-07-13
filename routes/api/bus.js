const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Bus = require("../../models/Bus");
const auth = require("../../middleware/auth");

// travels to add buses
router.post(
  "/add",
  auth,
  [
    check("from", "From is required").not().isEmpty(),
    check("to", "to is required ").not().isEmpty(),
    check("busModel", "Bus Model is required").not().isEmpty(),
    check("departureTime", "Departure Time is required").not().isEmpty(),
    check("arrivalTime", "Arrival Time is required").not().isEmpty(),
    check("fare", "Fare is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }
    try {
      const { from, to, busModel, departureTime, arrivalTime, fare } = req.body;
      const newBus = new Bus({
        postedBy: req.user._id,
        from: from,
        to: to,
        busModel: busModel,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        fare: fare,
        travels: req.user.travels,
        email: req.user.email,
      });

      await newBus.save();

      res.status(200).json({
        message: "Bus Added!",
        res: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: `Error Adding bus! ${err}`,
        res: false,
      });
    }
  }
);

//travels to view  their buses
router.get("/myBuses", auth, async (req, res) => {
  try {
    const getBuses = await Bus.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "travels email"
    );
    if (getBuses) {
      res.status(200).json({
        Buses: getBuses,
        res: true,
      });
    } else {
      res.status(201).json({
        Buses: null,
        res: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      Buses: null,
      res: false,
    });
  }
});

//customer to get buses
router.post(
  "/searchBuses",
  auth,
  [
    check("from", "From is required").not().isEmpty(),
    check("to", "to is required ").not().isEmpty(),
    check("date", "to is required ").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return res.status(400).json({ erros: errors });
    }
    try {
      const from = req.body.from;
      const to = req.body.to;
      const date = req.body.date;
      const buses = await Bus.find({
        from,
        to,
        date: { Sgte: new Date(date) },
      });

      if (buses.length === 0) {
        return res.status(404).json({ msg: "Bus not found" });
      }
      return res.status(200).json({ msg: "Available Buses", buses });
    } catch (err) {
      console.log(err);
      res.status(400).json("server error");
    }
  }
);

module.exports = router;
