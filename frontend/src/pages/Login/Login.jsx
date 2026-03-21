import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../../services/api';
import useAuth from '../../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await loginUser({ email, password });
            const { token, user } = response.data || {};
            if (token && user) {
                // Persist user for general app use
                // eslint-disable-next-line no-console
                console.log('Logged user:', user);
                login(token, user);
                toast.success('Login successful!');
                if (user.role === 'admin') {
                    localStorage.setItem('adminUser', JSON.stringify(user));
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                toast.error('Unexpected response from server');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid email or password');
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
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#222' }}>Welcome Back</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {/* Error display replaced by toast notification */}

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
                            placeholder="Enter your password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = '#e50914'}
                            onBlur={(e) => e.target.style.borderColor = '#ccc'}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', marginTop: '1rem' }}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                        New to Movie Booking? <Link to="/register" style={{ color: '#e50914', textDecoration: 'none', fontWeight: 'bold' }}>Register here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
