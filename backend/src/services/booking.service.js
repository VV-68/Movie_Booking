const Show = require('../models/show.model');
const Booking = require('../models/booking.model');
const { unlockSeat } = require('../utils/seatLock.util');

const confirmBookingService = async (userId, showId, requestedSeats) => {
    const show = await Show.findById(showId);
    if (!show) {
        throw new Error('Show not found');
    }

    // Check seat availability
    let unavailableSeats = [];
    requestedSeats.forEach(targetSeatNumber => {
        const seatObj = show.seats.find(s => s.seatNumber === targetSeatNumber);
        if (!seatObj || seatObj.isBooked) {
            unavailableSeats.push(targetSeatNumber);
        }
    });

    if (unavailableSeats.length > 0) {
        throw new Error(`Seats unavailable: ${unavailableSeats.join(', ')}`);
    }

    // Calculate total price
    const totalPrice = show.price * requestedSeats.length;

    // Mark seats as booked
    requestedSeats.forEach(targetSeatNumber => {
        const seatObj = show.seats.find(s => s.seatNumber === targetSeatNumber);
        seatObj.isBooked = true;
        unlockSeat(showId.toString(), targetSeatNumber); // Release temporary lock
    });

    await show.save();

    // Create booking record
    const booking = await Booking.create({
        userId,
        showId,
        seats: requestedSeats,
        totalPrice
    });

    return booking;
};

module.exports = {
    confirmBookingService
};
