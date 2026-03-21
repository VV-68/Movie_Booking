import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../../services/api';
import useAuth from '../../hooks/useAuth';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLoading(true);

        try {
            const response = await loginUser({ email, password });
            const { token, user } = response.data || {};

            if (!user || user.role !== 'admin') {
                toast.error('You are not authorized as an admin');
                return;
            }

            // Persist admin info separately for admin pages and as general user
            localStorage.setItem('adminUser', JSON.stringify(user));
            localStorage.setItem('user', JSON.stringify(user));
            // eslint-disable-next-line no-console
            console.log('Logged admin user:', user);
            login(token, user);
            toast.success('Admin login successful!');
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error('Invalid credentials or server error');
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
        transition: 'border-color 0.2s',
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '450px' }}>
            <div className="card" style={{ padding: '2.5rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#222' }}>Admin Login</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {/* Error display replaced by toast notification */}

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter admin email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                            onFocus={(e) => {
                                // eslint-disable-next-line no-param-reassign
                                e.target.style.borderColor = '#e50914';
                            }}
                            onBlur={(e) => {
                                // eslint-disable-next-line no-param-reassign
                                e.target.style.borderColor = '#ccc';
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            onFocus={(e) => {
                                // eslint-disable-next-line no-param-reassign
                                e.target.style.borderColor = '#e50914';
                            }}
                            onBlur={(e) => {
                                // eslint-disable-next-line no-param-reassign
                                e.target.style.borderColor = '#ccc';
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.8rem', marginTop: '1rem' }}
                    >
                        {loading ? 'Logging in...' : 'Login as Admin'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;

