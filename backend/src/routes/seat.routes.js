const express = require('express');
const router = express.Router();
const { getSeatLayout, lockSeats } = require('../controllers/seat.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/lock')
    .post(protect, lockSeats);

router.route('/:showId')
    .get(getSeatLayout);

module.exports = router;
