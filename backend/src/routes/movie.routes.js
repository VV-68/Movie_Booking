const express = require('express');
const router = express.Router();
const {
    getAllMovies,
    getMovieDetails,
    createMovie,
    updateMovie,
    deleteMovie,
} = require('../controllers/movie.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/role.middleware');

router.route('/')
    .get(getAllMovies)
    .post(protect, admin, createMovie);

router.route('/:id')
    .get(getMovieDetails)
    .put(protect, admin, updateMovie)
    .delete(protect, admin, deleteMovie);

module.exports = router;
