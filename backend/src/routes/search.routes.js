const express = require('express');
const router = express.Router();
const { searchMoviesByLocation } = require('../controllers/search.controller');

router.route('/location/:location')
    .get(searchMoviesByLocation);

module.exports = router;
