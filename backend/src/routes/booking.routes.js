const express = require('express');
const router = express.Router();
const {
    confirmBooking,
    getUserBookings,
    getBookingsForUserId,
} = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/role.middleware');

router.route('/')
    .post(protect, confirmBooking);

// Current authenticated user's bookings
router.route('/user')
    .get(protect, getUserBookings);

// Specific user's bookings (admin only)
router.route('/user/:userId')
    .get(protect, admin, getBookingsForUserId);

module.exports = router;
