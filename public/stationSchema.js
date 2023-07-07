const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
  {
    temperature: Number,
    humidity: Number,
    light: Number,
    pulsimeter: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = stationSchema;
