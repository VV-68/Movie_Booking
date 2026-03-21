import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getShowtimes, getSeats, updateShow, deleteShow } from '../../services/api';

// Note: we'll use GET /api/shows for all shows via getShowtimes with a dummy movieId pattern is not ideal,
// so better to call GET /api/shows directly via fetch here to avoid changing existing APIs used by frontend.

const AdminMyShows = () => {
    const navigate = useNavigate();
    const [shows, setShows] = useState([]);
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

        const fetchShows = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/shows');
                const data = await res.json();
                const allShows = Array.isArray(data) ? data : [];
                const mine = allShows.filter((show) => {
                    const tid = show.theatreId && (show.theatreId._id || show.theatreId);
                    return tid && tid.toString() === admin.theatreId;
                });
                setShows(mine);
            } catch (err) {
                setError('Failed to load shows');
            } finally {
                setLoading(false);
            }
        };

        fetchShows();
    }, [navigate]);

    const startEdit = (show) => {
        setEditingId(show._id);
        setEditForm({
            showTime: show.showTime?.slice(0, 16) || '',
            price: show.price,
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
                showTime: editForm.showTime,
                price: Number(editForm.price),
            };
            const response = await updateShow(id, payload);
            const updated = response.data || response;
            setShows((prev) => prev.map((s) => (s._id === id ? updated : s)));
            cancelEdit();
        } catch (err) {
            toast.error('Failed to update show');
        }
    };

    const removeShow = async (id) => {
        // eslint-disable-next-line no-alert
        const confirmDelete = window.confirm('Are you sure you want to delete this show?');
        if (!confirmDelete) return;
        try {
            await deleteShow(id);
            setShows((prev) => prev.filter((s) => s._id !== id));
        } catch (err) {
            toast.error('Failed to delete show');
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
            <h2 style={{ marginBottom: '2rem', color: '#222' }}>My Shows</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {shows.length === 0 ? (
                <p>No shows created yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {shows.map((show) => (
                        <div
                            key={show._id}
                            style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                            }}
                        >
                            {editingId === show._id ? (
                                <>
                                    <input
                                        type="datetime-local"
                                        name="showTime"
                                        value={editForm.showTime}
                                        onChange={handleEditChange}
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <input
                                        type="number"
                                        name="price"
                                        value={editForm.price}
                                        onChange={handleEditChange}
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => saveEdit(show._id)}
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
                                    <h3 style={{ margin: 0 }}>
                                        {show.movieId && show.movieId.title ? show.movieId.title : 'Show'}
                                    </h3>
                                    <p style={{ margin: 0, color: '#666' }}>
                                        {new Date(show.showTime).toLocaleString()} • ₹
                                        {show.price}
                                    </p>
                                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => startEdit(show)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => removeShow(show._id)}
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

export default AdminMyShows;

