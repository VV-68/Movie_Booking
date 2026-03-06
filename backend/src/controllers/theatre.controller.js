const mongoose = require('mongoose');
const Theatre = require('../models/theatre.model');

const getTheatres = async (req, res, next) => {
    try {
        const theatres = await Theatre.find({});
        return res.json(theatres);
    } catch (error) {
        return next(error);
    }
};

const createTheatre = async (req, res, next) => {
    try {
        const { name, location } = req.body;

        if (!name || !location) {
            res.status(400);
            throw new Error('Name and location are required');
        }

        const theatre = await Theatre.create({ name, location });
        return res.status(201).json(theatre);
    } catch (error) {
        return next(error);
    }
};

const getTheatreById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400);
            throw new Error('Invalid theatre id');
        }

        const theatre = await Theatre.findById(id);
        if (!theatre) {
            res.status(404);
            throw new Error('Theatre not found');
        }

        return res.json(theatre);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getTheatres,
    createTheatre,
    getTheatreById,
};

