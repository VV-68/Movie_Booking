import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
            toast.success('Show created successfully');
            navigate('/admin/my-shows');
        } catch (err) {
            setError('Failed to create show');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="card form-card" style={{ maxWidth: '650px' }}>
                <button 
                    onClick={() => navigate("/admin/dashboard")} 
                    className="btn"
                    style={{ marginBottom: '1.5rem', padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.1)' }}
                >
                    &larr; Back to Dashboard
                </button>
                <h2 className="text-center" style={{ marginBottom: '2rem' }}>Create Show</h2>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{ color: '#ffb3c1', background: 'rgba(229, 9, 20, 0.1)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1.5rem', border: '1px solid rgba(229,9,20,0.3)' }}>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Movie</label>
                        <select
                            name="movieId"
                            value={form.movieId}
                            onChange={handleChange}
                            required
                        >
                            <option value="" style={{ color: '#000' }}>Select a movie</option>
                            {movies.map((movie) => (
                                <option key={movie._id} value={movie._id} style={{ color: '#000' }}>
                                    {movie.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Show Time</label>
                        <input
                            type="datetime-local"
                            name="showTime"
                            value={form.showTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            min="1"
                            value={form.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '2rem' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#fff' }}>Seat Layout</h3>
                        
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Rows (Max 26)</label>
                                <input
                                    type="number"
                                    name="totalRows"
                                    min="1"
                                    max="26"
                                    value={form.totalRows}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Seats per Row</label>
                                <input
                                    type="number"
                                    name="seatsPerRow"
                                    min="1"
                                    value={form.seatsPerRow}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: '#aaa', fontSize: '1rem', textAlign: 'center' }}>Live Preview</h4>
                            <div style={{
                                width: '100%',
                                height: '6px',
                                background: 'rgba(255,255,255,0.3)',
                                borderRadius: '4px',
                                marginBottom: '1.5rem',
                                position: 'relative'
                            }}>
                                 <span style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#777', letterSpacing: '2px' }}>SCREEN</span>
                            </div>
                            
                            <div style={{ 
                                marginTop: '2.5rem',
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '0.5rem', 
                                alignItems: 'center',
                                overflowX: 'auto',
                                paddingBottom: '1rem'
                            }}>
                                {Array.from({ length: Math.min(Number(form.totalRows) || 0, 26) }).map((_, rIndex) => {
                                    const rowLabel = String.fromCharCode(65 + rIndex);
                                    return (
                                        <div key={rowLabel} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span style={{ width: '20px', fontWeight: 'bold', fontSize: '0.85rem', color: '#888', textAlign: 'right', marginRight: '0.5rem' }}>{rowLabel}</span>
                                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                                                {Array.from({ length: Number(form.seatsPerRow) || 0 }).map((_, sIndex) => (
                                                    <div 
                                                        key={`${rowLabel}${sIndex + 1}`}
                                                        title={`${rowLabel}${sIndex + 1}`}
                                                        style={{ 
                                                            width: '26px', 
                                                            height: '26px', 
                                                            background: 'rgba(255,255,255,0.8)', 
                                                            borderRadius: '6px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.65rem',
                                                            fontWeight: 'bold',
                                                            color: '#111',
                                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
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
                        style={{ width: '100%', marginTop: '2rem' }}
                    >
                        {loading ? 'Creating...' : 'Create Show'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminCreateShow;

