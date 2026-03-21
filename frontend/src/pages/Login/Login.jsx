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

    return (
        <div className="form-container">
            <div className="card form-card">
                <h2 className="text-center" style={{ marginBottom: '2rem' }}>Welcome Back</h2>

                <form onSubmit={handleSubmit}>
                    {/* Error display replaced by toast notification */}

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
                            placeholder="Enter your password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#aaa', fontSize: '0.95rem' }}>
                        New to Movie Booking? <Link to="/register" className="form-link">Register here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
