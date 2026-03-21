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
                <h2 style={{ color: '#fff', marginBottom: '1rem' }}>No Booking Details Found</h2>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '2rem' }}>
                <button 
                    onClick={() => navigate(-1)}
                    style={{
                        position: 'absolute',
                        left: 0,
                        background: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        fontSize: '1.5rem',
                        cursor: 'pointer'
                    }}
                    title="Back to Seat Booking"
                >
                    &larr; Back
                </button>
                <h2 style={{ margin: 0, color: '#fff' }}>Booking Summary</h2>
            </div>

            <div className="card" style={{ padding: '2.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#e50914', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                    Order Details
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#ccc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600', color: '#999' }}>Show ID:</span>
                        <span style={{ color: '#fff' }}>{showId}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600', color: '#999' }}>Selected Seats:</span>
                        <span style={{ color: '#fff' }}>{selectedSeats.join(', ')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600', color: '#999' }}>Total Seats:</span>
                        <span style={{ color: '#fff' }}>{selectedSeats.length} Ticket(s)</span>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px dashed rgba(255,255,255,0.2)', margin: '1rem 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>Amount Payable</span>
                        <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#28a745', textShadow: '0 0 10px rgba(40,167,69,0.3)' }}>₹{totalPrice}</span>
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
