const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    seatNumber: { type: String, required: true },
    row: { type: String, required: true },
    isBooked: { type: Boolean, default: false }
});

module.exports = seatSchema;
