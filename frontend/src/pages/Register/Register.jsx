import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isTheatreOwner, setIsTheatreOwner] = useState(false);
    const [theatreName, setTheatreName] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = { name, email, password };
            if (isTheatreOwner) {
                payload.theatreName = theatreName;
                payload.location = location;
            }
            const response = await registerUser(payload);
            if (response.data && response.data.token) {
                // Optionally log the user in immediately; for now, redirect to login
                // eslint-disable-next-line no-alert
                alert('Registration Successful!');
                navigate('/login');
            } else {
                // eslint-disable-next-line no-alert
                alert('Registration Successful!');
                navigate('/login');
            }
        } catch (err) {
            setError('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.8rem 1rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '450px' }}>
            <div className="card" style={{ padding: '2.5rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#222' }}>Create an Account</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {error && <div style={{ color: '#dc3545', background: '#f8d7da', padding: '0.8rem', borderRadius: '4px', textAlign: 'center' }}>{error}</div>}

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = '#e50914'}
                            onBlur={(e) => e.target.style.borderColor = '#ccc'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = '#e50914'}
                            onBlur={(e) => e.target.style.borderColor = '#ccc'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = '#e50914'}
                            onBlur={(e) => e.target.style.borderColor = '#ccc'}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <input
                            type="checkbox"
                            id="isTheatreOwner"
                            checked={isTheatreOwner}
                            onChange={(e) => setIsTheatreOwner(e.target.checked)}
                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                        />
                        <label htmlFor="isTheatreOwner" style={{ color: '#555', cursor: 'pointer', fontWeight: '500' }}>
                            Register as Theatre Owner
                        </label>
                    </div>

                    {isTheatreOwner && (
                        <>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>Theatre Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter theatre name"
                                    required={isTheatreOwner}
                                    value={theatreName}
                                    onChange={(e) => setTheatreName(e.target.value)}
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = '#e50914'}
                                    onBlur={(e) => e.target.style.borderColor = '#ccc'}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>Location</label>
                                <input
                                    type="text"
                                    placeholder="Enter city or area"
                                    required={isTheatreOwner}
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = '#e50914'}
                                    onBlur={(e) => e.target.style.borderColor = '#ccc'}
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', marginTop: '1rem' }}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/login" style={{ color: '#e50914', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
