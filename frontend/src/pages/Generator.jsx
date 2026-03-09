import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import { HiOutlineGlobeAlt, HiOutlineDocumentText, HiOutlineEnvelope, HiOutlinePhone, HiOutlineWifi, HiOutlineUserCircle, HiOutlineLockClosed, HiOutlineClock, HiOutlineBolt, HiOutlineArrowDownTray } from 'react-icons/hi2';
import './Generator.css';

const API_URL = `${API_BASE_URL}/api/qr`;

const QR_TYPES = [
    { id: 'url', label: 'URL', icon: <HiOutlineGlobeAlt /> },
    { id: 'text', label: 'Text', icon: <HiOutlineDocumentText /> },
    { id: 'email', label: 'Email', icon: <HiOutlineEnvelope /> },
    { id: 'phone', label: 'Phone', icon: <HiOutlinePhone /> },
    { id: 'wifi', label: 'WiFi', icon: <HiOutlineWifi /> },
    { id: 'vcard', label: 'vCard', icon: <HiOutlineUserCircle /> },
];

export default function Generator() {
    const [type, setType] = useState('url');
    const [title, setTitle] = useState('');
    const [data, setData] = useState({});
    const [password, setPassword] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [oneTime, setOneTime] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDataChange = (key, value) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/generate`, {
                type, title, data, password: password || undefined,
                expiresAt: expiresAt || undefined, oneTime
            });
            setResult(res.data.qr);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate QR code');
        }
        setLoading(false);
    };

    const renderTypeFields = () => {
        switch (type) {
            case 'url':
                return (
                    <div className="input-group">
                        <label>URL</label>
                        <input className="input-field" type="url" placeholder="https://example.com"
                            value={data.url || ''} onChange={e => handleDataChange('url', e.target.value)} required />
                    </div>
                );
            case 'text':
                return (
                    <div className="input-group">
                        <label>Text Content</label>
                        <textarea className="input-field" placeholder="Enter your text here..."
                            value={data.text || ''} onChange={e => handleDataChange('text', e.target.value)} required />
                    </div>
                );
            case 'email':
                return (
                    <>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input className="input-field" type="email" placeholder="recipient@example.com"
                                value={data.email || ''} onChange={e => handleDataChange('email', e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Subject</label>
                            <input className="input-field" placeholder="Email subject"
                                value={data.subject || ''} onChange={e => handleDataChange('subject', e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>Body</label>
                            <textarea className="input-field" placeholder="Email body..."
                                value={data.body || ''} onChange={e => handleDataChange('body', e.target.value)} />
                        </div>
                    </>
                );
            case 'phone':
                return (
                    <div className="input-group">
                        <label>Phone Number</label>
                        <input className="input-field" type="tel" placeholder="+1234567890"
                            value={data.phone || ''} onChange={e => handleDataChange('phone', e.target.value)} required />
                    </div>
                );
            case 'wifi':
                return (
                    <>
                        <div className="input-group">
                            <label>Network Name (SSID)</label>
                            <input className="input-field" placeholder="MyWiFi"
                                value={data.ssid || ''} onChange={e => handleDataChange('ssid', e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input className="input-field" type="password" placeholder="WiFi password"
                                value={data.wifiPassword || ''} onChange={e => handleDataChange('wifiPassword', e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>Encryption</label>
                            <select className="input-field" value={data.encryption || 'WPA'}
                                onChange={e => handleDataChange('encryption', e.target.value)}>
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">None</option>
                            </select>
                        </div>
                    </>
                );
            case 'vcard':
                return (
                    <>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input className="input-field" placeholder="John Doe"
                                value={data.fullName || ''} onChange={e => handleDataChange('fullName', e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Phone</label>
                            <input className="input-field" type="tel" placeholder="+1234567890"
                                value={data.phone || ''} onChange={e => handleDataChange('phone', e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input className="input-field" type="email" placeholder="john@example.com"
                                value={data.email || ''} onChange={e => handleDataChange('email', e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>Organization</label>
                            <input className="input-field" placeholder="Company name"
                                value={data.organization || ''} onChange={e => handleDataChange('organization', e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>Website</label>
                            <input className="input-field" type="url" placeholder="https://example.com"
                                value={data.website || ''} onChange={e => handleDataChange('website', e.target.value)} />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="generator-page page">
            <div className="container">
                <div className="generator-header animate-fade-in-up">
                    <h1>Generate QR Code</h1>
                    <p>Choose a type and customize your QR code</p>
                </div>

                <div className="generator-layout">
                    {/* Form */}
                    <div className="generator-form-section glass-card animate-fade-in-up">
                        {/* Type Selector */}
                        <div className="type-selector">
                            {QR_TYPES.map(t => (
                                <button key={t.id}
                                    className={`type-btn ${type === t.id ? 'active' : ''}`}
                                    onClick={() => { setType(t.id); setData({}); }}
                                    type="button">
                                    {t.icon}
                                    <span>{t.label}</span>
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="generator-form">
                            <div className="input-group">
                                <label>Title (optional)</label>
                                <input className="input-field" placeholder="My QR Code"
                                    value={title} onChange={e => setTitle(e.target.value)} />
                            </div>

                            {renderTypeFields()}

                            {/* Advanced Options */}
                            <div className="advanced-section">
                                <h3 className="advanced-title">Advanced Options</h3>
                                <div className="advanced-grid">
                                    <div className="input-group">
                                        <label><HiOutlineLockClosed /> Password Protection</label>
                                        <input className="input-field" type="password" placeholder="Leave empty for none"
                                            value={password} onChange={e => setPassword(e.target.value)} />
                                    </div>
                                    <div className="input-group">
                                        <label><HiOutlineClock /> Expiry Date</label>
                                        <input className="input-field" type="datetime-local"
                                            value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
                                    </div>
                                </div>
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={oneTime} onChange={e => setOneTime(e.target.checked)} />
                                    <HiOutlineBolt />
                                    <span>One-Time QR (single use)</span>
                                </label>
                            </div>

                            {error && <div className="message message-error">{error}</div>}

                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                                {loading ? 'Generating...' : 'Generate QR Code'}
                            </button>
                        </form>
                    </div>

                    {/* Preview */}
                    <div className="generator-preview animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                        {result ? (
                            <div className="preview-card glass-card">
                                <div className="preview-qr">
                                    <img src={result.qrDataUrl} alt="Generated QR Code" />
                                </div>
                                <h3 className="preview-title">{result.title}</h3>
                                <div className="preview-badges">
                                    <span className={`badge badge-${result.type}`}>{result.type}</span>
                                    {result.isPasswordProtected && <span className="badge badge-protected"><HiOutlineLockClosed /> Protected</span>}
                                    {result.maxScans === 1 && <span className="badge badge-onetime">One-Time</span>}
                                    {result.expiresAt && <span className="badge badge-expired"><HiOutlineClock /> Expires</span>}
                                </div>
                                <div className="preview-link">
                                    <code>{result.redirectUrl}</code>
                                </div>
                                <div className="preview-actions">
                                    <a href={result.qrDataUrl} download={`${result.title || 'qrcode'}.png`} className="btn btn-primary">
                                        <HiOutlineArrowDownTray /> Download PNG
                                    </a>
                                    <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(result.redirectUrl)}>
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="preview-empty glass-card">
                                <div className="preview-empty-icon">
                                    <HiOutlineGlobeAlt />
                                </div>
                                <p>Your QR code preview will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
