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

    return (
        <div className="form-container">
            <div className="card form-card">
                <h2 className="text-center" style={{ marginBottom: '2rem' }}>Admin Login</h2>

                <form onSubmit={handleSubmit}>
                    {/* Error display replaced by toast notification */}

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter admin email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        {loading ? 'Logging in...' : 'Login as Admin'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;

