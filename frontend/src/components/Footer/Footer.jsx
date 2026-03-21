import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Footer.css';

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  const homeLink = user?.role === 'admin' ? '/admin/home' : '/';

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>Movie Booking</h2>
          <p>&copy; {currentYear} Movie Booking. All rights reserved.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to={homeLink}>Home</Link></li>
            <li><Link to={user?.role === 'admin' ? '/admin/profile' : '/profile'}>Profile</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
