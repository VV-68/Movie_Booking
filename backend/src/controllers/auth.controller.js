const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return secret;
};

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            theatreId: user.theatreId,
        },
        getJwtSecret(),
        {
            expiresIn: '30d',
        },
    );
};

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400);
            throw new Error('Name, email and password are required');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400);
            throw new Error('Invalid email format');
        }

        if (password.length < 6) {
            res.status(400);
            throw new Error('Password must be at least 6 characters long');
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if theatre details are provided to register as an admin
        let newTheatreId = null;
        let role = 'user';

        if (req.body.theatreName && req.body.location) {
            const Theatre = require('../models/theatre.model');
            const theatre = await Theatre.create({
                name: req.body.theatreName,
                location: req.body.location,
            });
            newTheatreId = theatre._id;
            role = 'admin';
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            ...(newTheatreId && { theatreId: newTheatreId }),
        });

        if (!user) {
            res.status(400);
            throw new Error('Invalid user data');
        }

        return res.status(201).json({
            token: generateToken(user),
            user: {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                theatreId: user.theatreId,
            },
        });
    } catch (error) {
        return next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            throw new Error('Email and password are required');
        }

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        return res.json({
            token: generateToken(user),
            user: {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                theatreId: user.theatreId,
            },
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
};
