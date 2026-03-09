import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page page">
            <div className="container">
                <div className="auth-card glass-card animate-fade-in-up">
                    <div className="auth-header">
                        <h1>Welcome Back</h1>
                        <p>Sign in to your QRIFY account</p>
                    </div>

                    {error && <div className="message message-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" className="input-field" placeholder="you@example.com"
                                value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" className="input-field" placeholder="••••••••"
                                value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/signup">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
