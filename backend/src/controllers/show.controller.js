const mongoose = require('mongoose');
const Show = require('../models/show.model');

const getAllShows = async (req, res, next) => {
try {
const shows = await Show.find({})
.populate('theatreId')
.populate('movieId');


    return res.status(200).json(shows);
} catch (error) {
    return next(error);
}


};

const getShowsForMovie = async (req, res, next) => {
try {
const { movieId } = req.params;


    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        res.status(400);
        throw new Error('Invalid movie id');
    }

    const shows = await Show.find({
        movieId: new mongoose.Types.ObjectId(movieId)
    }).populate('theatreId');

    return res.status(200).json(shows);
} catch (error) {
    return next(error);
}


};

const getShowById = async (req, res, next) => {
try {
const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid show id');
    }

    const show = await Show.findById(id)
        .populate('theatreId')
        .populate('movieId');

    if (!show) {
        res.status(404);
        throw new Error('Show not found');
    }

    return res.status(200).json(show);
} catch (error) {
    return next(error);
}


};

const createShow = async (req, res, next) => {
try {
const {
movieId,
showTime,
price,
totalRows,
seatsPerRow,
} = req.body;


    if (!movieId || !showTime || !price) {
        res.status(400);
        throw new Error('movieId, showTime and price are required');
    }

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        res.status(400);
        throw new Error('Invalid movieId');
    }

    const adminTheatreId = req.user && req.user.theatreId;
    if (!adminTheatreId) {
        res.status(400);
        throw new Error('Admin is not associated with a theatre');
    }

    // Generate seat layout
    const seats = [];
    const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const actualRows = totalRows || 10;
    const actualSeatsPerRow = seatsPerRow || 10;

    for (let r = 0; r < actualRows; r++) {
        for (let s = 1; s <= actualSeatsPerRow; s++) {
            seats.push({
                seatNumber: `${rows[r]}${s}`,
                row: rows[r],
                isBooked: false,
            });
        }
    }

    const show = await Show.create({
        movieId: new mongoose.Types.ObjectId(movieId),
        theatreId: new mongoose.Types.ObjectId(adminTheatreId),
        showTime,
        price,
        seats,
    });

    return res.status(201).json(show);
} catch (error) {
    return next(error);
}


};

const updateShow = async (req, res, next) => {
try {
const { id } = req.params;
const updates = req.body;


    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid show id');
    }

    const show = await Show.findById(id);
    if (!show) {
        res.status(404);
        throw new Error('Show not found');
    }

    if (!show.theatreId || show.theatreId.toString() !== req.user.theatreId?.toString()) {
        res.status(403);
        throw new Error('Not authorized to modify this show');
    }

    const allowedFields = ['showTime', 'price'];
    allowedFields.forEach((field) => {
        if (typeof updates[field] !== 'undefined') {
            show[field] = updates[field];
        }
    });

    const updated = await show.save();
    return res.json(updated);
} catch (error) {
    return next(error);
}


};

const deleteShow = async (req, res, next) => {
try {
const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid show id');
    }

    const show = await Show.findById(id);
    if (!show) {
        res.status(404);
        throw new Error('Show not found');
    }

    if (!show.theatreId || show.theatreId.toString() !== req.user.theatreId?.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this show');
    }

    await show.deleteOne();
    return res.status(204).send();
} catch (error) {
    return next(error);
}


};

module.exports = {
getAllShows,
getShowsForMovie,
getShowById,
createShow,
updateShow,
deleteShow,
};
