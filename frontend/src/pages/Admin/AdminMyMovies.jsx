import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMovies, updateMovie, deleteMovie } from '../../services/api';

const AdminMyMovies = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        const stored = localStorage.getItem('adminUser');
        if (!stored) {
            navigate('/admin/login');
            return;
        }
        const admin = JSON.parse(stored);

        const fetchMovies = async () => {
            try {
                const response = await getMovies();
                const allMovies = response.data || [];
                const mine = allMovies.filter(
                    (m) => m.createdBy && m.createdBy.toString() === admin._id,
                );
                setMovies(mine);
            } catch (err) {
                setError('Failed to load movies');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [navigate]);

    const startEdit = (movie) => {
        setEditingId(movie._id);
        setEditForm({
            title: movie.title,
            description: movie.description,
            poster: movie.poster,
            language: movie.language,
            duration: movie.duration,
            genre: movie.genre,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const saveEdit = async (id) => {
        try {
            const payload = {
                ...editForm,
                duration: Number(editForm.duration),
            };
            const response = await updateMovie(id, payload);
            const updated = response.data || response;
            setMovies((prev) => prev.map((m) => (m._id === id ? updated : m)));
            cancelEdit();
        } catch (err) {
            toast.error('Failed to update movie');
        }
    };

    const removeMovie = async (id) => {
        // eslint-disable-next-line no-alert
        const confirmDelete = window.confirm('Are you sure you want to delete this movie?');
        if (!confirmDelete) return;
        try {
            await deleteMovie(id);
            setMovies((prev) => prev.filter((m) => m._id !== id));
        } catch (err) {
            toast.error('Failed to delete movie');
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#fff' }}>
                Loading...
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#fff' }}>My Movies</h2>
            {error && <p style={{ color: '#ffb3c1' }}>{error}</p>}
            {movies.length === 0 ? (
                <p style={{ color: '#ccc' }}>No movies created yet.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {movies.map((movie) => (
                        <div
                            key={movie._id}
                            className="card"
                            style={{
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.8rem',
                            }}
                        >
                            {editingId === movie._id ? (
                                <>
                                    <input
                                        name="title"
                                        value={editForm.title}
                                        onChange={handleEditChange}
                                        className="form-group"
                                        style={{ marginBottom: '0.5rem', padding: '0.6rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px' }}
                                    />
                                    <textarea
                                        name="description"
                                        value={editForm.description}
                                        onChange={handleEditChange}
                                        style={{ marginBottom: '0.5rem', padding: '0.6rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px' }}
                                    />
                                    <input
                                        name="poster"
                                        value={editForm.poster}
                                        onChange={handleEditChange}
                                        style={{ marginBottom: '0.5rem', padding: '0.6rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px' }}
                                    />
                                    <input
                                        name="language"
                                        value={editForm.language}
                                        onChange={handleEditChange}
                                        style={{ marginBottom: '0.5rem', padding: '0.6rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px' }}
                                    />
                                    <input
                                        name="duration"
                                        type="number"
                                        value={editForm.duration}
                                        onChange={handleEditChange}
                                        style={{ marginBottom: '0.5rem', padding: '0.6rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px' }}
                                    />
                                    <input
                                        name="genre"
                                        value={editForm.genre}
                                        onChange={handleEditChange}
                                        style={{ marginBottom: '1rem', padding: '0.6rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px' }}
                                    />
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => saveEdit(movie._id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={cancelEdit}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.4rem' }}>{movie.title}</h3>
                                    <p style={{ margin: 0, color: '#ccc', fontSize: '0.9rem' }}>{movie.language} • {movie.genre}</p>
                                    <p style={{ margin: 0, color: '#999', fontSize: '0.85rem' }}>{movie.duration} min</p>
                                    <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', gap: '0.8rem' }}>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => startEdit(movie)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => removeMovie(movie._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminMyMovies;

