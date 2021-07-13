const express = require("express");
const router = express.Router();
const gravator = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const { check, validationResult } = require("express-validator");

const TravelAgency = require("../../models/TravelAgency");

//@route Post api/user
//@desc Register user
//@acress Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("travels", "Travels name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("contact", "Please include a valid Phone Number").isNumeric(),
    check("gstin", "GSTIN is required").not().isEmpty(),
    check(
      "password",
      "Please enter a password with 6 or more character"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, travels, email, contact, gstin, password } = req.body;

    try {
      let user = await TravelAgency.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      const avatar = gravator.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new TravelAgency({
        name,
        travels,
        email,
        contact,
        gstin,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({msg:"sign up success", token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
