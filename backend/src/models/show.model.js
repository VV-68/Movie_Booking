const mongoose = require('mongoose');
const seatSchema = require('./seat.model');

const showSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theatreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
    showTime: { type: Date, required: true },
    price: { type: Number, required: true },
    seats: [seatSchema]
});

module.exports = mongoose.model('Show', showSchema);
