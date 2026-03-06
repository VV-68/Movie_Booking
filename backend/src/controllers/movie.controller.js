const mongoose = require('mongoose');
const Movie = require('../models/movie.model');

const getAllMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find({});
        return res.json(movies);
    } catch (error) {
        return next(error);
    }
};

const getMovieDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400);
            throw new Error('Invalid movie id');
        }

        const movie = await Movie.findById(id);
        if (!movie) {
            res.status(404);
            throw new Error('Movie not found');
        }
        return res.json(movie);
    } catch (error) {
        return next(error);
    }
};

const createMovie = async (req, res, next) => {
    try {
        const { title, description, poster, language, duration, genre } = req.body;

        if (!title || !description || !poster || !language || !duration || !genre) {
            res.status(400);
            throw new Error('All movie fields are required');
        }

        const movie = await Movie.create({
            title,
            description,
            poster,
            language,
            duration,
            genre,
            createdBy: req.user?._id || null,
        });
        return res.status(201).json(movie);
    } catch (error) {
        return next(error);
    }
};

const updateMovie = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400);
            throw new Error('Invalid movie id');
        }

        const movie = await Movie.findById(id);
        if (!movie) {
            res.status(404);
            throw new Error('Movie not found');
        }

        if (!movie.createdBy || movie.createdBy.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to modify this movie');
        }

        const allowedFields = ['title', 'description', 'poster', 'language', 'duration', 'genre'];
        allowedFields.forEach((field) => {
            if (typeof updates[field] !== 'undefined') {
                movie[field] = updates[field];
            }
        });

        const updated = await movie.save();
        return res.json(updated);
    } catch (error) {
        return next(error);
    }
};

const deleteMovie = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400);
            throw new Error('Invalid movie id');
        }

        const movie = await Movie.findById(id);
        if (!movie) {
            res.status(404);
            throw new Error('Movie not found');
        }

        if (!movie.createdBy || movie.createdBy.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete this movie');
        }

        await movie.deleteOne();
        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getAllMovies,
    getMovieDetails,
    createMovie,
    updateMovie,
    deleteMovie,
};
