const mongoose = require('mongoose');
const seatAvailabilitySchema = new mongoose.Schema({
  sleeper: Number,
  AC: Number
});
const priceSchema = new mongoose.Schema({
  sleeper: Number,
  AC: Number
});

const trainSchema = new mongoose.Schema({
  trainName: String,
  trainNumber: String,
  departureTime: {
    Hours: Number,
    Minutes: Number
  },
  seatsAvailable: seatAvailabilitySchema,
  price: priceSchema,
  delayedBy: Number
});

const Train = mongoose.model('Train', trainSchema);

module.exports = {
  Train
};