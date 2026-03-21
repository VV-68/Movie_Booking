import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookTickets } from '../../services/api';
import useAuth from '../../hooks/useAuth';

const AdminBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [isBooking, setIsBooking] = useState(false);

    // If directly navigated without state
    if (!location.state) {
        return (
            <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h2 style={{ color: '#222', marginBottom: '1rem' }}>No Booking Details Found</h2>
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => navigate('/')}
                >
                    Go to Home
                </button>
            </div>
        );
    }

    const { showId, selectedSeats, totalPrice } = location.state;

    const handleConfirm = () => {
        if (!token) {
            toast.error('Authentication failed! Please log in.');
            navigate('/login');
            return;
        }
        navigate('/payment', { state: { showId, selectedSeats, totalPrice }, replace: false });
    };

    return (
        <div className="container" style={{ padding: '3rem 1rem', maxWidth: '600px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#222' }}>Booking Summary</h2>

            <div className="card" style={{ padding: '2.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#e50914', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    Order Details
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#444' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600' }}>Show ID:</span>
                        <span>{showId}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600' }}>Selected Seats:</span>
                        <span>{selectedSeats.join(', ')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600' }}>Total Seats:</span>
                        <span>{selectedSeats.length} Ticket(s)</span>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px dashed #ccc', margin: '1rem 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#222' }}>Amount Payable</span>
                        <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#e50914' }}>₹{totalPrice}</span>
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleConfirm}
                    disabled={false}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1.1rem',
                        marginTop: '2.5rem',
                        cursor: 'pointer',
                    }}
                >
                    Confirm Payment
                </button>
            </div>
        </div>
    );
};

export default AdminBooking;
