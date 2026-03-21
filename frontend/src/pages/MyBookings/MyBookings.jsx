import React, { useEffect, useState } from 'react';
import { getCurrentUserBookings, deleteBooking } from '../../services/api';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import Ticket from '../../components/Ticket/Ticket';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);

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
            toast.success('Booking cancelled successfully');
        } catch (error) {
            console.error('Error cancelling booking', error);
            toast.error(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#fff', fontSize: '2rem' }}>My Bookings</h2>

            {bookings.length === 0 ? (
                <p style={{ color: '#ccc', fontSize: '1.1rem' }}>You have no bookings yet.</p>
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
                                className="card"
                                style={{
                                    padding: 0,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {movie.poster && (
                                    <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                                        <img
                                            src={movie.poster}
                                            alt={movie.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', padding: '1.5rem 1rem 0.5rem' }}>
                                            <h3 className="movie-overlay-title" style={{ margin: 0, fontSize: '1.4rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{movie.title || 'Unknown Movie'}</h3>
                                        </div>
                                    </div>
                                )}
                                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
                                    {!movie.poster && <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>{movie.title || 'Unknown Movie'}</h3>}
                                    <p style={{ margin: 0, color: '#ccc', fontSize: '0.95rem' }}>
                                        <strong style={{ color: '#fff' }}>Theatre:</strong> {theatre.name || 'Unknown Theatre'}, {theatre.location || 'Unknown Location'}
                                    </p>
                                    <p style={{ margin: 0, color: '#ccc', fontSize: '0.95rem' }}>
                                        <strong style={{ color: '#fff' }}>Show Time:</strong> {new Date(showId?.showTime).toLocaleString()}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ margin: 0, color: '#ccc', fontSize: '0.95rem' }}>
                                            <strong style={{ color: '#fff' }}>Seats:</strong> {seats.join(', ')}
                                        </p>
                                        <p style={{ margin: 0, color: '#28a745', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            ₹{totalPrice}
                                        </p>
                                    </div>
                                    <p style={{ margin: 'auto 0 0 0', color: '#777', fontSize: '0.8rem', paddingTop: '1rem' }}>
                                        Booked On: {new Date(bookingTime).toLocaleString()}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                                        <button 
                                            onClick={() => setSelectedTicket(booking)}
                                            className="btn btn-primary"
                                            style={{ flex: 1 }}
                                        >
                                            View Ticket
                                        </button>
                                        <button 
                                            onClick={() => handleCancelBooking(booking._id)}
                                            className="btn btn-danger"
                                            style={{ flex: 1 }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedTicket && (
                <Ticket booking={selectedTicket} onClose={() => setSelectedTicket(null)} />
            )}
        </div>
    );
};

export default MyBookings;
