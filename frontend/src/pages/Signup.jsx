import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signup(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page page">
            <div className="container">
                <div className="auth-card glass-card animate-fade-in-up">
                    <div className="auth-header">
                        <h1>Create Account</h1>
                        <p>Join QRIFY and start generating smart QR codes</p>
                    </div>

                    {error && <div className="message message-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <input id="name" type="text" className="input-field" placeholder="John Doe"
                                value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" className="input-field" placeholder="you@example.com"
                                value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" className="input-field" placeholder="Min. 6 characters"
                                value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
