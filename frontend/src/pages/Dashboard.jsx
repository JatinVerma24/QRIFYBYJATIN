import { useState, useEffect } from 'react';
import axios from 'axios';
import QRCard from '../components/QRCard';
import { HiOutlinePlusCircle, HiOutlineQrCode, HiOutlineEye } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const API_URL = 'http://localhost:5000/api/qr';

export default function Dashboard() {
    const [qrCodes, setQrCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchQRCodes = async () => {
        try {
            const res = await axios.get(`${API_URL}/my-codes`);
            setQrCodes(res.data.qrCodes);
        } catch (err) {
            setMessage('Failed to load QR codes');
        }
        setLoading(false);
    };

    useEffect(() => { fetchQRCodes(); }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setQrCodes(prev => prev.map(qr => qr.id === id ? { ...qr, isActive: false } : qr));
            setMessage('QR code deactivated');
            setTimeout(() => setMessage(''), 3000);
        } catch {
            setMessage('Failed to deactivate QR code');
        }
    };

    const handleCopyLink = (url) => {
        navigator.clipboard.writeText(url);
        setMessage('Link copied to clipboard!');
        setTimeout(() => setMessage(''), 3000);
    };

    const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0);
    const activeCount = qrCodes.filter(qr => qr.isActive && !qr.isExpired).length;

    return (
        <div className="dashboard-page page">
            <div className="container">
                <div className="dashboard-header animate-fade-in-up">
                    <div>
                        <h1>My QR Codes</h1>
                        <p>Manage and track all your generated QR codes</p>
                    </div>
                    <Link to="/generate" className="btn btn-primary">
                        <HiOutlinePlusCircle /> New QR Code
                    </Link>
                </div>

                {/* Stats */}
                <div className="stats-grid animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-card card">
                        <div className="stat-icon"><HiOutlineQrCode /></div>
                        <div className="stat-value">{qrCodes.length}</div>
                        <div className="stat-label">Total QR Codes</div>
                    </div>
                    <div className="stat-card card">
                        <div className="stat-icon stat-icon-active"><HiOutlineQrCode /></div>
                        <div className="stat-value">{activeCount}</div>
                        <div className="stat-label">Active</div>
                    </div>
                    <div className="stat-card card">
                        <div className="stat-icon stat-icon-scans"><HiOutlineEye /></div>
                        <div className="stat-value">{totalScans}</div>
                        <div className="stat-label">Total Scans</div>
                    </div>
                </div>

                {message && <div className="message message-success animate-fade-in">{message}</div>}

                {/* QR Cards */}
                {loading ? (
                    <div className="dashboard-loading">
                        <p>Loading your QR codes...</p>
                    </div>
                ) : qrCodes.length === 0 ? (
                    <div className="dashboard-empty glass-card animate-fade-in-up">
                        <div className="empty-icon"><HiOutlineQrCode /></div>
                        <h3>No QR codes yet</h3>
                        <p>Generate your first QR code to get started</p>
                        <Link to="/generate" className="btn btn-primary">
                            <HiOutlinePlusCircle /> Generate QR Code
                        </Link>
                    </div>
                ) : (
                    <div className="dashboard-grid">
                        {qrCodes.map(qr => (
                            <QRCard key={qr.id} qr={qr} onDelete={handleDelete} onCopyLink={handleCopyLink} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
