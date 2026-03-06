const mongoose = require('mongoose');
const Show = require('../models/show.model');
const { lockSeat } = require('../utils/seatLock.util');

const getSeatLayout = async (req, res, next) => {
    try {
        const { showId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(showId)) {
            res.status(400);
            throw new Error('Invalid show id');
        }

        const show = await Show.findById(showId);
        if (!show) {
            res.status(404);
            throw new Error('Show not found');
        }
        return res.json(show.seats);
    } catch (error) {
        return next(error);
    }
};

const lockSeats = async (req, res, next) => {
    try {
        const { showId, seats } = req.body;

        if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
            res.status(400);
            throw new Error('Please provide showId and a non-empty seats array to lock');
        }

        if (!mongoose.Types.ObjectId.isValid(showId)) {
            res.status(400);
            throw new Error('Invalid show id');
        }

        const userId = req.user._id;
        const lockedSeats = [];
        const failedSeats = [];

        for (const seatNumber of seats) {
            const success = lockSeat(showId, seatNumber, userId);
            if (success) {
                lockedSeats.push(seatNumber);
            } else {
                failedSeats.push(seatNumber);
            }
        }

        if (failedSeats.length > 0) {
            return res.status(409).json({
                message: 'Some seats could not be locked as they are already locked or invalid',
                lockedSeats,
                failedSeats,
            });
        }

        return res.json({ message: 'Seats locked successfully', lockedSeats });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getSeatLayout,
    lockSeats,
};
