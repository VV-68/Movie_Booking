const mongoose = require('mongoose');
const Show = require('../models/show.model');

const searchMoviesByLocation = async (req, res, next) => {
    try {
        const { location } = req.params;

        if (!location || typeof location !== 'string') {
            res.status(400);
            throw new Error('Location is required');
        }

        // Case-insensitive regex for location search
        const locationRegex = new RegExp(location, 'i');

        // Find shows where the populated theatre's location matches the search
        // Since populate filtering in Mongoose is tricky, we'll first find the theatres
        const Theatre = require('../models/theatre.model');
        const theatres = await Theatre.find({ location: locationRegex });
        const theatreIds = theatres.map((t) => t._id);

        if (theatreIds.length === 0) {
            return res.json([]);
        }

        // Find all shows linked to these theatres, populate the movie
        const shows = await Show.find({ theatreId: { $in: theatreIds } }).populate('movieId');

        // Extract unique movies from these shows
        const moviesMap = new Map();
        shows.forEach(show => {
            if (show.movieId && !moviesMap.has(show.movieId._id.toString())) {
                moviesMap.set(show.movieId._id.toString(), show.movieId);
            }
        });

        const uniqueMovies = Array.from(moviesMap.values());

        return res.json(uniqueMovies);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    searchMoviesByLocation,
};
