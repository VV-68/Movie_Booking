import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMovie } from '../../services/api';

const AdminCreateMovie = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        description: '',
        poster: '',
        language: '',
        duration: '',
        genre: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('adminUser');
        if (!stored) {
            navigate('/admin/login');
        }
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
                ...form,
                duration: Number(form.duration),
            };
            await createMovie(payload);
            // eslint-disable-next-line no-alert
            alert('Movie created successfully');
            navigate('/admin/my-movies');
        } catch (err) {
            setError('Failed to create movie');
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
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#222' }}>Create Movie</h2>
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
                    <label style={{ display: 'block', marginBottom: '0.4rem' }}>Title</label>
                    <input name="title" value={form.title} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem' }}>Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem' }}>Poster URL</label>
                    <input name="poster" value={form.poster} onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.4rem' }}>Language</label>
                        <input name="language" value={form.language} onChange={handleChange} required style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.4rem' }}>Duration (minutes)</label>
                        <input
                            name="duration"
                            type="number"
                            min="1"
                            value={form.duration}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem' }}>Genre</label>
                    <input name="genre" value={form.genre} onChange={handleChange} required style={inputStyle} />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ marginTop: '1rem', padding: '0.9rem', fontSize: '1rem' }}
                >
                    {loading ? 'Creating...' : 'Create Movie'}
                </button>
            </form>
        </div>
    );
};

export default AdminCreateMovie;

