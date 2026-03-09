import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { HiOutlineLockClosed } from 'react-icons/hi2';
import './Auth.css';

const API_URL = 'http://localhost:5000';

export default function PasswordEntry() {
    const { shortId } = useParams();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/r/${shortId}/verify`, { password });
            if (res.data.redirect) {
                window.location.href = res.data.redirect;
            } else {
                setContent(res.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        }
        setLoading(false);
    };

    if (content) {
        return (
            <div className="auth-page page">
                <div className="container">
                    <div className="auth-card glass-card animate-fade-in-up">
                        <div className="auth-header">
                            <h1>{content.title || 'QR Content'}</h1>
                            <span className={`badge badge-${content.type}`}>{content.type}</span>
                        </div>
                        <div style={{ padding: '20px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', wordBreak: 'break-all', whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            {content.content}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page page">
            <div className="container">
                <div className="auth-card glass-card animate-fade-in-up">
                    <div className="auth-header">
                        <div style={{ fontSize: '2.5rem', color: 'var(--accent-primary)', marginBottom: '12px' }}>
                            <HiOutlineLockClosed />
                        </div>
                        <h1>Password Required</h1>
                        <p>This QR code is password protected</p>
                    </div>

                    {error && <div className="message message-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <label htmlFor="qr-password">Password</label>
                            <input id="qr-password" type="password" className="input-field" placeholder="Enter QR password"
                                value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                            {loading ? 'Verifying...' : 'Unlock Content'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
