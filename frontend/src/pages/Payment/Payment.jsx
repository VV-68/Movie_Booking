import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookTickets, getShowById } from '../../services/api';
import useAuth from '../../hooks/useAuth';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, user } = useAuth();

    const [upiId, setUpiId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
    const [showDetails, setShowDetails] = useState(null);
    const [loadingShow, setLoadingShow] = useState(true);

    if (!location.state) {
        return (
            <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h2 style={{ color: '#222', marginBottom: '1rem' }}>No Payment Details Found</h2>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Go to Home</button>
            </div>
        );
    }

    const { showId, selectedSeats, totalPrice } = location.state;

    useEffect(() => {
        const fetchShowObj = async () => {
            try {
                const res = await getShowById(showId);
                setShowDetails(res.data);
            } catch (err) {
                console.error('Failed to fetch show details', err);
                toast.error('Failed to load show details');
            } finally {
                setLoadingShow(false);
            }
        };
        fetchShowObj();
    }, [showId]);

    useEffect(() => {
        let timer;
        if (isProcessing && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isProcessing, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleProceed = async (e) => {
        e.preventDefault();
        if (!upiId.trim()) {
            toast.error('Please enter a valid UPI ID');
            return;
        }
        if (!token) {
            toast.error('Session expired. Please login.');
            navigate('/login');
            return;
        }

        setIsProcessing(true);
        toast.info('Payment initiated. Complete within 3 minutes', { autoClose: 5000 });

        // Simulate 30s delay before payment success
        setTimeout(async () => {
            try {
                // Execute actual booking API
                const response = await bookTickets({ showId, seats: selectedSeats });
                if (response.data && response.data._id) {
                    toast.success('Payment successful');
                    navigate(user?.role === 'admin' ? '/admin/my-bookings' : '/my-bookings');
                } else {
                    toast.error('Booking failed after payment. Please contact support.');
                    setIsProcessing(false);
                }
            } catch (error) {
                console.error(error);
                toast.error('Booking failed. Please try again.');
                setIsProcessing(false);
            }
        }, 15000);
    };

    if (loadingShow) {
        return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading payment details...</div>;
    }

    const movieName = showDetails?.movieId?.title || 'Unknown Movie';
    const theatreName = showDetails?.theatreId?.name || 'Unknown Theatre';
    const theatreLocation = showDetails?.theatreId?.location || 'Unknown Location';
    const showTimeStr = showDetails?.showTime ? new Date(showDetails.showTime).toLocaleString() : 'Unknown Time';

    return (
        <div className="form-container">
            <div className="card form-card" style={{ maxWidth: '550px' }}>
                <h2 className="text-center" style={{ marginBottom: '2.5rem' }}>Secure Payment</h2>
                
                <h3 style={{ marginBottom: '1.5rem', color: '#e50914', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', fontSize: '1.3rem' }}>
                    Booking Summary
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#ccc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '500', color: '#999' }}>Movie Name:</span>
                        <span style={{ fontWeight: '600', color: '#fff' }}>{movieName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '500', color: '#999' }}>Theatre:</span>
                        <span style={{ fontWeight: '600', color: '#fff', textAlign: 'right' }}>{theatreName}<br/> <span style={{fontSize: '0.85rem', color: '#ccc'}}>{theatreLocation}</span></span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '500', color: '#999' }}>Date & Time:</span>
                        <span style={{ fontWeight: '600', color: '#fff' }}>{showTimeStr}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '500', color: '#999' }}>Selected Seats:</span>
                        <span style={{ fontWeight: '600', color: '#fff' }}>{selectedSeats.join(', ')}</span>
                    </div>
                    
                    <hr style={{ border: 'none', borderTop: '1px dashed rgba(255,255,255,0.2)', margin: '1rem 0' }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>Total Amount</span>
                        <span style={{ fontWeight: '700', fontSize: '1.6rem', color: '#28a745', textShadow: '0 0 10px rgba(40, 167, 69, 0.4)' }}>₹{totalPrice}</span>
                    </div>
                </div>

                <form onSubmit={handleProceed} style={{ marginTop: '2.5rem' }}>
                    <div className="form-group">
                        <label>Enter UPI ID</label>
                        <input 
                            type="text" 
                            placeholder="example@upi" 
                            required 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            disabled={isProcessing}
                            style={{ padding: '1.2rem 1.5rem', fontSize: '1.1rem' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isProcessing}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            marginTop: '0.5rem',
                        }}
                    >
                        {isProcessing ? 'Processing (Do not close)...' : 'Proceed to Pay'}
                    </button>

                    {isProcessing && (
                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                            <p style={{ color: '#ccc', fontSize: '0.95rem', marginBottom: '0.8rem' }}>
                                Please hold on while we secure your booking.
                            </p>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#e50914', textShadow: '0 0 15px rgba(229, 9, 20, 0.5)' }}>
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Payment;
