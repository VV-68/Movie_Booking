import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovies, createShow } from '../../services/api';

const AdminCreateShow = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [form, setForm] = useState({
        movieId: '',
        showTime: '',
        price: '',
        totalRows: 10,
        seatsPerRow: 12,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('adminUser');
        if (!stored) {
            navigate('/admin/login');
            return;
        }

        const fetchMovies = async () => {
            try {
                const response = await getMovies();
                setMovies(response.data || []);
            } catch (err) {
                setError('Failed to load movies');
            }
        };

        fetchMovies();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = {
                movieId: form.movieId,
                showTime: form.showTime,
                price: Number(form.price),
                totalRows: Number(form.totalRows),
                seatsPerRow: Number(form.seatsPerRow)
            };
            await createShow(payload);
            // eslint-disable-next-line no-alert
            alert('Show created successfully');
            navigate('/admin/my-shows');
        } catch (err) {
            setError('Failed to create show');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.7rem 1rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
    };

    return (
        <div className="container" style={{ padding: '3rem 1rem', maxWidth: '700px' }}>
            <button 
                onClick={() => navigate("/admin/dashboard")} 
                style={{ marginBottom: '1rem', padding: '0.5rem 1rem', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                Back to Dashboard
            </button>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#222' }}>Create Show</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {error && (
                    <div
                        style={{
                            color: '#dc3545',
                            background: '#f8d7da',
                            padding: '0.8rem',
                            borderRadius: '4px',
                            textAlign: 'center',
                        }}
                    >
                        {error}
                    </div>
                )}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem' }}>Movie</label>
                    <select
                        name="movieId"
                        value={form.movieId}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    >
                        <option value="">Select a movie</option>
                        {movies.map((movie) => (
                            <option key={movie._id} value={movie._id}>
                                {movie.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem' }}>Show Time</label>
                    <input
                        type="datetime-local"
                        name="showTime"
                        value={form.showTime}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem' }}>Price</label>
                    <input
                        type="number"
                        name="price"
                        min="1"
                        value={form.price}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9', marginTop: '1rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#444' }}>Seat Layout</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.4rem' }}>Number of Rows (Max 26)</label>
                            <input
                                type="number"
                                name="totalRows"
                                min="1"
                                max="26"
                                value={form.totalRows}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.4rem' }}>Seats per Row</label>
                            <input
                                type="number"
                                name="seatsPerRow"
                                min="1"
                                value={form.seatsPerRow}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h4 style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '1rem' }}>Live Preview</h4>
                        <div style={{
                            width: '100%',
                            height: '6px',
                            background: '#ccc',
                            borderRadius: '4px',
                            marginBottom: '1rem',
                            textAlign: 'center',
                            position: 'relative'
                        }}>
                             <span style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', color: '#999', letterSpacing: '1px' }}>SCREEN</span>
                        </div>
                        
                        <div style={{ 
                            marginTop: '2rem',
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '0.4rem', 
                            alignItems: 'center',
                            overflowX: 'auto',
                            paddingBottom: '1rem'
                        }}>
                            {Array.from({ length: Math.min(Number(form.totalRows) || 0, 26) }).map((_, rIndex) => {
                                const rowLabel = String.fromCharCode(65 + rIndex);
                                return (
                                    <div key={rowLabel} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                        <span style={{ width: '20px', fontWeight: 'bold', fontSize: '0.8rem', color: '#555', textAlign: 'right', marginRight: '0.5rem' }}>{rowLabel}</span>
                                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                                            {Array.from({ length: Number(form.seatsPerRow) || 0 }).map((_, sIndex) => (
                                                <div 
                                                    key={`${rowLabel}${sIndex + 1}`}
                                                    title={`${rowLabel}${sIndex + 1}`}
                                                    style={{ 
                                                        width: '24px', 
                                                        height: '24px', 
                                                        background: '#fff', 
                                                        border: '1px solid #28a745',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.6rem',
                                                        color: '#333'
                                                    }}
                                                >
                                                    {sIndex + 1}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ marginTop: '1rem', padding: '0.9rem', fontSize: '1rem' }}
                >
                    {loading ? 'Creating...' : 'Create Show'}
                </button>
            </form>
        </div>
    );
};

export default AdminCreateShow;

