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
            <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                Loading...
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#222' }}>My Movies</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {movies.length === 0 ? (
                <p>No movies created yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {movies.map((movie) => (
                        <div
                            key={movie._id}
                            style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                            }}
                        >
                            {editingId === movie._id ? (
                                <>
                                    <input
                                        name="title"
                                        value={editForm.title}
                                        onChange={handleEditChange}
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <textarea
                                        name="description"
                                        value={editForm.description}
                                        onChange={handleEditChange}
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <input
                                        name="poster"
                                        value={editForm.poster}
                                        onChange={handleEditChange}
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <input
                                        name="language"
                                        value={editForm.language}
                                        onChange={handleEditChange}
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <input
                                        name="duration"
                                        type="number"
                                        value={editForm.duration}
                                        onChange={handleEditChange}
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <input
                                        name="genre"
                                        value={editForm.genre}
                                        onChange={handleEditChange}
                                        style={{ marginBottom: '0.5rem' }}
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
                                    <h3 style={{ margin: 0 }}>{movie.title}</h3>
                                    <p style={{ margin: 0, color: '#666' }}>{movie.language} • {movie.genre}</p>
                                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
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

