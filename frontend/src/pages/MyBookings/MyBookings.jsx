import React, { useEffect, useState } from 'react';
import { getCurrentUserBookings, deleteBooking } from '../../services/api';
import Loader from '../../components/Loader/Loader';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getCurrentUserBookings();
                const data = response?.data ?? response;
                setBookings(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching bookings', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleCancelBooking = async (bookingId) => {
        const confirm = window.confirm('Are you sure you want to cancel this booking?');
        if (!confirm) return;

        try {
            await deleteBooking(bookingId);
            setBookings((prev) => prev.filter((b) => b._id !== bookingId));
            alert('Booking cancelled successfully');
        } catch (error) {
            console.error('Error cancelling booking', error);
            alert(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#222', fontSize: '1.8rem' }}>My Bookings</h2>

            {bookings.length === 0 ? (
                <p>You have no bookings yet.</p>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem',
                    }}
                >
                    {bookings.map((booking) => {
                        const { showId, seats, totalPrice, bookingTime } = booking;
                        const movie = showId?.movieId || {};
                        const theatre = showId?.theatreId || {};

                        return (
                            <div
                                key={booking._id}
                                style={{
                                    border: '1px solid #eee',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: '#fff',
                                }}
                            >
                                {movie.poster && (
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>{movie.title || 'Unknown Movie'}</h3>
                                    <p style={{ margin: 0, color: '#555' }}>
                                        <strong>Theatre:</strong> {theatre.name || 'Unknown Theatre'}, {theatre.location || 'Unknown Location'}
                                    </p>
                                    <p style={{ margin: 0, color: '#555' }}>
                                        <strong>Show Time:</strong> {new Date(showId?.showTime).toLocaleString()}
                                    </p>
                                    <p style={{ margin: 0, color: '#555' }}>
                                        <strong>Seats:</strong> {seats.join(', ')}
                                    </p>
                                    <p style={{ margin: 0, color: '#555' }}>
                                        <strong>Total Price:</strong> Rs. {totalPrice}
                                    </p>
                                    <p style={{ margin: 0, color: '#777', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                        <strong>Booked On:</strong> {new Date(bookingTime).toLocaleString()}
                                    </p>
                                    <button 
                                        onClick={() => handleCancelBooking(booking._id)}
                                        style={{ 
                                            marginTop: '1rem', 
                                            padding: '0.6rem', 
                                            background: '#dc3545', 
                                            color: 'white', 
                                            border: 'none', 
                                            borderRadius: '4px', 
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Cancel Booking
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
