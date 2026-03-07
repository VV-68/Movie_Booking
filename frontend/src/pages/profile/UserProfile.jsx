import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/Loader/Loader';
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const { logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile();
                setProfile(response.data);
            } catch (err) {
                setError('Failed to load profile details');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);
    const handleLogout = () => {
    logout();
    navigate('/');
};

    if (loading) return <Loader />;

    return (
        <div className="container" style={{ padding: '3rem 1rem', maxWidth: '600px' }}>
            <div style={{
                background: '#fff',
                padding: '2.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#222' }}>My Profile</h2>
                
                {error ? (
                    <div style={{ color: '#dc3545', textAlign: 'center' }}>{error}</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '0.8rem' }}>
                            <strong style={{ color: '#555' }}>Name:</strong>
                            <p style={{ margin: '0.4rem 0 0 0', fontSize: '1.1rem', color: '#222' }}>{profile?.name}</p>
                        </div>
                        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '0.8rem' }}>
                            <strong style={{ color: '#555' }}>Email Address:</strong>
                            <p style={{ margin: '0.4rem 0 0 0', fontSize: '1.1rem', color: '#222' }}>{profile?.email}</p>
                        </div>

                        <button 
                            onClick={handleLogout}
                            style={{ 
                                marginTop: '1.5rem', 
                                padding: '0.8rem', 
                                background: '#dc3545', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
