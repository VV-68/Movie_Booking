import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSeats, getShowById } from '../../services/api';
import Seat from '../../components/Seat/Seat';
import Loader from '../../components/Loader/Loader';
import useAuth from '../../hooks/useAuth';

const SeatSelection = () => {
    const { showId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [layout, setLayout] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPrice, setShowPrice] = useState(0);

    useEffect(() => {
        const fetchSeatsAndShow = async () => {
            try {
                const [seatsResponse, showResponse] = await Promise.all([
                    getSeats(showId),
                    getShowById(showId)
                ]);
                const seats = seatsResponse.data || [];
                setShowPrice(showResponse.data?.price || 0);

                // Group seats by row from backend data
                const grouped = seats.reduce((acc, seat) => {
                    const rowLabel = seat.row;
                    // eslint-disable-next-line no-param-reassign
                    if (!acc[rowLabel]) acc[rowLabel] = [];
                    acc[rowLabel].push({
                        id: seat.seatNumber,
                        isBooked: seat.isBooked,
                    });
                    return acc;
                }, {});

                const sortedRows = Object.keys(grouped).sort();
                const layoutData = sortedRows.map((row) => ({
                    row,
                    seats: grouped[row],
                }));

                setLayout(layoutData);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error fetching seats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSeatsAndShow();
    }, [showId]);

    const toggleSeat = (seatId) => {
        setSelectedSeats((prev) => (prev.includes(seatId)
            ? prev.filter((id) => id !== seatId)
            : [...prev, seatId]));
    };

    const handleConfirm = () => {
        if (selectedSeats.length === 0) {
            toast.error('Please select at least one seat.');
            return;
        }
        if (!token) {
            toast.error('Please login to continue booking');
            navigate('/login');
            return;
        }
        const totalPrice = selectedSeats.length * showPrice;
        navigate('/booking', { state: { showId, selectedSeats, totalPrice } });
    };

    if (loading) return <Loader />;

    return (
        <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px', textAlign: 'center', color: '#fff' }}>
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
                    title="Back to Movie Details"
                >
                    &larr; Back
                </button>
                <h2 style={{ margin: 0, color: '#fff' }}>Select Your Seats</h2>
            </div>

            <div className="card" style={{
                padding: '3rem 2rem',
                marginBottom: '2rem'
            }}>

                <div style={{ marginBottom: '3rem' }}>
                    <div style={{
                        height: '10px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '10px 10px 0 0',
                        width: '80%',
                        margin: '0 auto',
                        boxShadow: '0 -4px 15px rgba(255,255,255,0.05)'
                    }}></div>
                    <p style={{ marginTop: '0.5rem', color: '#ccc', letterSpacing: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>SCREEN THIS WAY</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
                    {layout.map((rowObj) => (
                        <div key={rowObj.row} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ width: '25px', fontWeight: 'bold', color: '#ccc', textAlign: 'right' }}>{rowObj.row}</span>
                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                                {rowObj.seats.map(seat => (
                                    <Seat
                                        key={seat.id}
                                        seatNumber={seat.id}
                                        isBooked={seat.isBooked}
                                        isSelected={selectedSeats.includes(seat.id)}
                                        onSelect={toggleSeat}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: '3rem',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    padding: '1rem',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '8px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '20px', height: '20px', background: '#e50914', borderRadius: '4px' }}></div>
                        <span style={{ color: '#ccc', fontSize: '0.9rem' }}>Available</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '20px', height: '20px', background: '#555', borderRadius: '4px' }}></div>
                        <span style={{ color: '#ccc', fontSize: '0.9rem' }}>Booked</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '20px', height: '20px', background: '#28a745', borderRadius: '4px', boxShadow: '0 0 10px rgba(40,167,69,0.5)' }}></div>
                        <span style={{ color: '#ccc', fontSize: '0.9rem' }}>Selected</span>
                    </div>
                </div>

            </div>

            {selectedSeats.length > 0 && (
                <div className="card" style={{
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    bottom: '20px',
                    margin: '0 auto',
                    width: '100%',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(229, 9, 20, 0.3)'
                }}>
                    <div style={{ textAlign: 'left' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>Selected: {selectedSeats.join(', ')}</h3>
                        <p style={{ margin: 0, fontSize: '1.2rem', color: '#ccc', fontWeight: 'bold' }}>
                            Total: <span style={{ color: '#28a745', textShadow: '0 0 10px rgba(40,167,69,0.4)' }}>₹{selectedSeats.length * showPrice}</span>
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleConfirm}
                        style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}
                    >
                        Confirm Seats
                    </button>
                </div>
            )}
        </div>
    );
};

export default SeatSelection;
