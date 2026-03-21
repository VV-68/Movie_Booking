import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/Loader/Loader';
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
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


    if (loading) return <Loader />;

    return (
        <div className="container" style={{ padding: '3rem 1rem', maxWidth: '600px' }}>
            <div className="card" style={{ padding: '2.5rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#fff' }}>My Profile</h2>
                
                {error ? (
                    <div style={{ color: '#dc3545', textAlign: 'center' }}>{error}</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem' }}>
                            <strong style={{ color: '#ccc' }}>Name:</strong>
                            <p style={{ margin: '0.4rem 0 0 0', fontSize: '1.1rem', color: '#fff' }}>{profile?.name}</p>
                        </div>
                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem' }}>
                            <strong style={{ color: '#ccc' }}>Email Address:</strong>
                            <p style={{ margin: '0.4rem 0 0 0', fontSize: '1.1rem', color: '#fff' }}>{profile?.email}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
