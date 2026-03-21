import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
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
                toast.success('Registration Successful!');
                navigate('/login');
            } else {
                toast.success('Registration Successful!');
                navigate('/login');
            }
        } catch (err) {
            setError('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="card form-card">
                <h2 className="text-center" style={{ marginBottom: '2rem' }}>Create an Account</h2>

                <form onSubmit={handleSubmit}>
                    {error && <div style={{ color: '#ffb3c1', background: 'rgba(229, 9, 20, 0.1)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1.5rem', border: '1px solid rgba(229,9,20,0.3)' }}>{error}</div>}

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <input
                            type="checkbox"
                            id="isTheatreOwner"
                            checked={isTheatreOwner}
                            onChange={(e) => setIsTheatreOwner(e.target.checked)}
                            style={{ cursor: 'pointer', width: '20px', height: '20px', margin: 0 }}
                        />
                        <label htmlFor="isTheatreOwner" style={{ margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            Register as Theatre Owner
                        </label>
                    </div>

                    {isTheatreOwner && (
                        <>
                            <div className="form-group">
                                <label>Theatre Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter theatre name"
                                    required={isTheatreOwner}
                                    value={theatreName}
                                    onChange={(e) => setTheatreName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    placeholder="Enter city or area"
                                    required={isTheatreOwner}
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#aaa', fontSize: '0.95rem' }}>
                        Already have an account? <Link to="/login" className="form-link">Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
