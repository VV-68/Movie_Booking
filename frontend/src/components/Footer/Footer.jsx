import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Footer.css';

const Footer = () => {
    const { user } = useAuth();
    const currentYear = new Date().getFullYear();

    const homeLink = user?.role === 'admin' ? '/admin/home' : '/';
    const bookingsLink = user?.role === 'admin' ? '/admin/my-bookings' : '/my-bookings';
    const profileLink = user?.role === 'admin' ? '/admin/profile' : '/profile';

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Branding Section */}
                <div className="footer-section branding">
                    <h2>Movie Booking</h2>
                    <p>Book your favorite movies instantly 🎬</p>
                </div>

                {/* Quick Links Section */}
                <div className="footer-section links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to={homeLink}>Home</Link></li>
                        <li><Link to={bookingsLink}>My Bookings</Link></li>
                        <li><Link to={profileLink}>Profile</Link></li>
                    </ul>
                </div>

                {/* Support & Info Section */}
                <div className="footer-section support">
                    <h4>Support & Info</h4>
                    <p>
                        Email: <a href="mailto:lukysphere01@gmail.com">support@moviebooking.com</a>
                    </p>
                    <p>Built with React & Node.js</p>
                    <p>
                        GitHub: <a href="https://github.com/VV-68" target="_blank" rel="noopener noreferrer">github.com/VV-68</a>
                    </p>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="footer-bottom">
                <p>&copy; {currentYear} Movie Booking. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
