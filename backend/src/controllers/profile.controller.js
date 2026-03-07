const User = require('../models/user.model');
const Theatre = require('../models/theatre.model');

// @desc    Get Admin Profile
// @route   GET /api/admin/profile
// @access  Private/Admin
const getAdminProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        let theatreName = 'No Theatre Assigned';
        let location = 'Unknown';

        if (user.theatreId) {
            const theatre = await Theatre.findById(user.theatreId);
            if (theatre) {
                theatreName = theatre.name;
                location = theatre.location;
            }
        }

        res.json({
            name: user.name,
            email: user.email,
            theatreName,
            location
        });
    } catch (error) {
        return next(error);
    }
};

// @desc    Get User Profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.json({
            name: user.name,
            email: user.email
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getAdminProfile,
    getUserProfile
};
