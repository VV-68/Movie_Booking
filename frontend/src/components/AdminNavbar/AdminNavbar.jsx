import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        sessionStorage.clear();
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

    const btnStyle = {
        background: '#dc3545',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    return (
        <nav style={navStyle}>
            <div style={linkContainerStyle}>
                <Link to="/" style={linkStyle}>Home</Link>
                <Link to="/admin/dashboard" style={linkStyle}>Dashboard</Link>
                <Link to="/admin/create-movie" style={linkStyle}>Create Movie</Link>
                <Link to="/admin/create-show" style={linkStyle}>Create Show</Link>
                <Link to="/admin/my-movies" style={linkStyle}>My Movies</Link>
                <Link to="/admin/my-shows" style={linkStyle}>My Shows</Link>
                <button onClick={handleLogout} style={btnStyle}>Logout</button>
            </div>
        </nav>
    );
};

export default AdminNavbar;
