import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getMovies = () => API.get('/movies');

export const getAllShows = () => API.get('/shows');

export const getMovieDetails = (id) => API.get(`/movies/${id}`);

export const getShowtimes = (movieId) => API.get(`/shows/${movieId}`);

export const getShowById = (showId) => API.get(`/shows/show/${showId}`);

export const getSeats = (showId) => API.get(`/seats/${showId}`);

export const bookTickets = ({ showId, seats }) => API.post('/bookings', { showId, seats });

export const createMovie = (payload) => API.post('/movies', payload);
export const updateMovie = (id, payload) => API.put(`/movies/${id}`, payload);
export const deleteMovie = (id) => API.delete(`/movies/${id}`);

export const createShow = (payload) => API.post('/shows', payload);
export const updateShow = (id, payload) => API.put(`/shows/show/${id}`, payload);
export const deleteShow = (id) => API.delete(`/shows/show/${id}`);

export const loginUser = (data) => API.post('/auth/login', data);

export const registerUser = (data) => API.post('/auth/register', data);

export const getCurrentUserBookings = () => API.get('/bookings/user');

