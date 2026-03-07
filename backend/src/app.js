const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const movieRoutes = require('./routes/movie.routes');
const showRoutes = require('./routes/show.routes');
const seatRoutes = require('./routes/seat.routes');
const bookingRoutes = require('./routes/booking.routes');
const theatreRoutes = require('./routes/theatre.routes');
const searchRoutes = require('./routes/search.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/search', searchRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('Movie Booking Backend Running');
});

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
