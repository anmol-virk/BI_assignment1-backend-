const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['Online', 'Offline'], required: true },
  description: String,
  thumbnail: String,
  price: Number,
  venue: {
    address: String,
  },
  additionalInfo: String,
  tags: [String]
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
