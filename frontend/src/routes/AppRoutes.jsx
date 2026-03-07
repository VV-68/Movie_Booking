import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import MovieDetails from '../pages/MovieDetails/MovieDetails';
import SeatSelection from '../pages/SeatSelection/SeatSelection';
import Booking from '../pages/Booking/Booking';
import MyBookings from '../pages/MyBookings/MyBookings';
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminCreateMovie from '../pages/Admin/AdminCreateMovie';
import AdminCreateShow from '../pages/Admin/AdminCreateShow';
import AdminMyMovies from '../pages/Admin/AdminMyMovies';
import AdminMyShows from '../pages/Admin/AdminMyShows';
import AdminLayout from '../pages/admin/AdminLayout';
import Profile from '../pages/admin/Profile';
import UserProfile from '../pages/profile/UserProfile';
import AdminHome from '../pages/admin/AdminHome';
import AdminMovieDetails from '../pages/admin/AdminMovieDetails';
import AdminSeatSelection from '../pages/admin/AdminSeatSelection';
import AdminBooking from '../pages/admin/AdminBooking';
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/seats/:showId" element={<SeatSelection />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="home" element={<AdminHome />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="create-movie" element={<AdminCreateMovie />} />
                <Route path="create-show" element={<AdminCreateShow />} />
                <Route path="my-movies" element={<AdminMyMovies />} />
                <Route path="my-shows" element={<AdminMyShows />} />
                <Route path="profile" element={<Profile />} />
                <Route path="my-bookings" element={<MyBookings />} />
                <Route path="movie/:id" element={<AdminMovieDetails />} />
                <Route path="seats/:id" element={<AdminSeatSelection />} />
                <Route path="booking" element={<AdminBooking />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
