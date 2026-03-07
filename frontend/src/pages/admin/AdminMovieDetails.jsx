import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getShowtimes } from '../../services/api';
import Loader from '../../components/Loader/Loader';

const AdminMovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [movieRes, timesRes] = await Promise.all([
                    getMovieDetails(id),
                    getShowtimes(id),
                ]);

                const movieData = movieRes?.data ?? movieRes;
                const showData = timesRes?.data ?? timesRes;

                setMovie(movieData);
                setShowtimes(Array.isArray(showData) ? showData : []);
            } catch (error) {
                console.error('Error fetching details', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) return <Loader />;

    if (!movie) {
        return (
            <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem' }}>
                Movie not found
            </div>
        );
    }

    // Group showtimes by theatre
    const groupedTimes = showtimes.reduce((acc, curr) => {
        const theatreName = curr.theatreId?.name || 'Unknown Theatre';

        if (!acc[theatreName]) {
            acc[theatreName] = [];
        }

        acc[theatreName].push(curr);

        return acc;
    }, {});

    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <div
                className="movie-details-layout"
                style={{
                    display: 'flex',
                    gap: '3rem',
                    background: '#fff',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
            >
                <div style={{ width: '300px', flexShrink: 0 }}>
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        style={{
                            width: '100%',
                            borderRadius: '12px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        }}
                    />
                </div>

                <div style={{ flexGrow: 1 }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        {movie.title}
                    </h1>

                    <p style={{ color: '#666', marginBottom: '1rem' }}>
                        {movie.language} • {movie.duration} • {movie.genre}
                    </p>

                    <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
                        {movie.description}
                    </p>

                    <hr style={{ margin: '2rem 0' }} />

                    <h2 style={{ marginBottom: '1.5rem' }}>Available Showtimes</h2>

                    {Object.keys(groupedTimes).length === 0 && (
                        <p>No showtimes available.</p>
                    )}

                    {Object.keys(groupedTimes).map((theatre) => (
                        <div key={theatre} style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>
                                🎬 {theatre}
                            </h3>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {groupedTimes[theatre].map((show) => (
                                    <button
                                        key={show._id}
                                        onClick={() => navigate(`/admin/seats/${show._id}`)}
                                        style={{
                                            padding: '0.6rem 1.2rem',
                                            background: '#fff',
                                            color: '#28a745',
                                            border: '1px solid #28a745',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                        }}
                                    >
                                        {new Date(show.showTime).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminMovieDetails;