const mongoose = require('mongoose');
const { confirmBookingService } = require('../services/booking.service');
const Booking = require('../models/booking.model');

const confirmBooking = async (req, res, next) => {
    try {
        const { showId, seats } = req.body;
        const userId = req.user._id;

        if (!showId || !mongoose.Types.ObjectId.isValid(showId)) {
            res.status(400);
            throw new Error('Valid showId is required');
        }

        if (!seats || !Array.isArray(seats) || seats.length === 0) {
            res.status(400);
            throw new Error('No seats selected');
        }

        const booking = await confirmBookingService(userId, showId, seats);
        return res.status(201).json(booking);
    } catch (error) {
        // Seat conflicts or unavailable seats should be a 409
        if (!res.headersSent) {
            res.status(res.statusCode && res.statusCode !== 200 ? res.statusCode : 409);
        }
        return next(error);
    }
};

const getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).populate({
            path: 'showId',
            populate: [
                { path: 'movieId' },
                { path: 'theatreId' }
            ]
        });
        return res.json(bookings);
    } catch (error) {
        return next(error);
    }
};

const getBookingsForUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400);
            throw new Error('Invalid user id');
        }

        const bookings = await Booking.find({ userId }).populate('showId');
        return res.json(bookings);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    confirmBooking,
    getUserBookings,
    getBookingsForUserId,
};
