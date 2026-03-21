import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './Ticket.css';

const Ticket = ({ booking, onClose }) => {
    if (!booking) return null;

    const { showId, seats, totalPrice, bookingTime } = booking;
    const movie = showId?.movieId || {};
    const theatre = showId?.theatreId || {};

    const showDateObj = new Date(showId?.showTime);
    const dateStr = showDateObj.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = showDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="ticket-overlay" onClick={onClose}>
            <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ticket-header">
                    <h2>{movie.title || 'Movie Ticket'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="ticket-body">
                    <div className="ticket-info">
                        <div className="info-group">
                            <label>Theatre</label>
                            <p>{theatre.name || 'Theatre Name'}</p>
                            <p className="sub-text">{theatre.location || 'Location'}</p>
                        </div>
                        <div className="info-row">
                            <div className="info-group">
                                <label>Date</label>
                                <p>{dateStr}</p>
                            </div>
                            <div className="info-group">
                                <label>Time</label>
                                <p>{timeStr}</p>
                            </div>
                        </div>
                        <div className="info-group">
                            <label>Seats Booked</label>
                            <p className="seats-highlight">{seats.join(', ')}</p>
                        </div>
                        <div className="info-group" style={{ marginTop: '1rem' }}>
                            <label>Booked At</label>
                            <p className="sub-text">{bookingTime ? new Date(bookingTime).toLocaleString() : new Date().toLocaleString()}</p>
                        </div>
                    </div>
                    
                    <div className="ticket-stub">
                        <div className="info-group">
                            <label>Amount Paid</label>
                            <p className="amount-highlight">₹{totalPrice}</p>
                        </div>
                        <div className="barcode-mock" style={{ margin: '0 1rem', display: 'flex', alignItems: 'center' }}>
                            <QRCodeSVG value="https://github.com/VV-68" size={64} />
                        </div>
                        <p className="booking-id">ID: {booking._id?.slice(-8).toUpperCase()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ticket;
