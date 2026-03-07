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

