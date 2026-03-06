const express = require('express');
const { getTheatres, createTheatre, getTheatreById } = require('../controllers/theatre.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/role.middleware');

const router = express.Router();

router.route('/')
    .get(getTheatres)
    .post(protect, admin, createTheatre);

router.route('/:id')
    .get(getTheatreById);

module.exports = router;

