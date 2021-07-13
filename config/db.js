const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  if  (process.env.NODE_ENV !== "test"){
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log("MongoBD connected..");
  } catch (err) {
    console.error(err.message);

    process.exist(1);
  }
}};

module.exports = connectDB;
