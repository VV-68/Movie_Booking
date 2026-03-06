import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import MovieDetails from '../pages/MovieDetails/MovieDetails';
import SeatSelection from '../pages/SeatSelection/SeatSelection';
import Booking from '../pages/Booking/Booking';
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminCreateMovie from '../pages/Admin/AdminCreateMovie';
import AdminCreateShow from '../pages/Admin/AdminCreateShow';
import AdminMyMovies from '../pages/Admin/AdminMyMovies';
import AdminMyShows from '../pages/Admin/AdminMyShows';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/seats/:showId" element={<SeatSelection />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/create-movie" element={<AdminCreateMovie />} />
            <Route path="/admin/create-show" element={<AdminCreateShow />} />
            <Route path="/admin/my-movies" element={<AdminMyMovies />} />
            <Route path="/admin/my-shows" element={<AdminMyShows />} />
        </Routes>
    );
};

export default AppRoutes;
