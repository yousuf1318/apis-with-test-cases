const express = require("express");
const connectDB = require("./config/db");
// const path = require("path");
const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

//Routes
app.use("/api/user", require("./routes/api/user")); //For user sign up
app.use("/api/auth", require("./routes/api/auth")); //For user sign in
app.use("/api/travelagency", require("./routes/api/travelAgency")); //Fro traveler sign up
app.use("/api/travelagency", require("./routes/api/travelAgencyAuth")); //Fro traveler sign in
app.use("/api/buses", require("./routes/api/bus")); // To get all the buses
app.use("/api/ticket", require("./routes/api/ticket")); // For cancle/book tickets


if (!module.parent) {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server is listening on port 5000");
    });
  }



module.exports=app