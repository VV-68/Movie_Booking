import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../Navbar/Navbar.css';

const AdminNavbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/admin/home">Admin Panel</Link>
                </div>
                <div className="navbar-links">
                    <Link to="/admin/home">Home</Link>
                    <Link to="/admin/dashboard">Dashboard</Link>
                    <Link to="/admin/create-movie">Create Movie</Link>
                    <Link to="/admin/create-show">Create Show</Link>
                    <Link to="/admin/my-movies">Movies</Link>
                    <Link to="/admin/my-shows">Shows</Link>
                    <Link to="/admin/my-bookings">Bookings</Link>
                    <Link className="profile-btn" to="/admin/profile">Profile</Link>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
