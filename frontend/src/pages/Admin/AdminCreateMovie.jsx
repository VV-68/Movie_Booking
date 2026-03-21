import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
            toast.success('Movie created successfully');
            navigate('/admin/my-movies');
        } catch (err) {
            setError('Failed to create movie');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="card form-card" style={{ maxWidth: '600px' }}>
                <button 
                    onClick={() => navigate("/admin/dashboard")} 
                    className="btn"
                    style={{ marginBottom: '1.5rem', padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.1)' }}
                >
                    &larr; Back to Dashboard
                </button>
                <h2 className="text-center" style={{ marginBottom: '2rem' }}>Create Movie</h2>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{ color: '#ffb3c1', background: 'rgba(229, 9, 20, 0.1)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1.5rem', border: '1px solid rgba(229,9,20,0.3)' }}>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Title</label>
                        <input name="title" value={form.title} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            style={{ height: '100px', resize: 'vertical' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Poster URL</label>
                        <input name="poster" value={form.poster} onChange={handleChange} required />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Language</label>
                            <input name="language" value={form.language} onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Duration (minutes)</label>
                            <input
                                name="duration"
                                type="number"
                                min="1"
                                value={form.duration}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Genre</label>
                        <input name="genre" value={form.genre} onChange={handleChange} required />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        {loading ? 'Creating...' : 'Create Movie'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminCreateMovie;

