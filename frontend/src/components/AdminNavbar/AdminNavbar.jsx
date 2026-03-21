import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AdminNavbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navStyle = {
        background: '#333',
        color: '#fff',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const linkContainerStyle = {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
    };

    const linkStyle = {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '1rem',
    };

    return (
        <nav style={navStyle}>
            <div style={linkContainerStyle}>
                <Link to="/admin/home" style={linkStyle}>Home</Link>
                <Link to="/admin/dashboard" style={linkStyle}>Dashboard</Link>
                <Link to="/admin/create-movie" style={linkStyle}>Create Movie</Link>
                <Link to="/admin/create-show" style={linkStyle}>Create Show</Link>
                <Link to="/admin/my-movies" style={linkStyle}>My Movies</Link>
                <Link to="/admin/my-shows" style={linkStyle}>My Shows</Link>
                <Link to="/admin/my-bookings" style={linkStyle}>My Bookings</Link>
                <Link to="/admin/profile" style={linkStyle}>Profile</Link>
                <button
                    onClick={handleLogout}
                    style={{ ...linkStyle, background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', padding: 0 }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default AdminNavbar;
