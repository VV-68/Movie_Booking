const express = require('express');
const router = express.Router();
const {
    getAllShows,
    getShowsForMovie,
    getShowById,
    createShow,
    updateShow,
    deleteShow,
} = require('../controllers/show.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/role.middleware');

router.route('/')
    .get(getAllShows)
    .post(protect, admin, createShow);

// More specific route first: get single show by id
router.route('/show/:id')
    .get(getShowById)
    .put(protect, admin, updateShow)
    .delete(protect, admin, deleteShow);

// Shows for a movie: GET /api/shows/:movieId
router.route('/:movieId')
    .get(getShowsForMovie);

module.exports = router;
