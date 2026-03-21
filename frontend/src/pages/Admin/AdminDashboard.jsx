import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('adminUser');
        if (!stored) {
            navigate('/admin/login');
        }
    }, [navigate]);

    return (
        <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#fff' }}>Admin Dashboard</h2>
            <div className="card" style={{ padding: '2rem' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/create-movie')}
                >
                    Create Movie
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/create-show')}
                >
                    Create Show
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin/my-movies')}
                >
                    My Movies
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin/my-shows')}
                >
                    My Shows
                </button>
            </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

