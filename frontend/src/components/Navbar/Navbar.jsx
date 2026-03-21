import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/">Movie Booking</Link>
                </div>
                <div className="navbar-links">
                    <Link to="/">Home</Link>
                    {!token ? (
                        <>
                            <Link to="/login">Login</Link>
                            <Link className="register-btn" to="/register">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/my-bookings">My Bookings</Link>
                            <Link className="profile-btn" to="/profile">Profile</Link>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
