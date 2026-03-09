import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineQrCode, HiOutlineShieldCheck, HiOutlineClock, HiOutlineChartBar, HiOutlineLockClosed, HiOutlineBolt } from 'react-icons/hi2';
import './Landing.css';

export default function Landing() {
    const { user } = useAuth();

    const features = [
        { icon: <HiOutlineQrCode />, title: 'Multi-Type QR', desc: 'Generate QR codes for URLs, text, email, phone, WiFi, and contact cards' },
        { icon: <HiOutlineChartBar />, title: 'Scan Analytics', desc: 'Track every scan with real-time counters and insights' },
        { icon: <HiOutlineClock />, title: 'Expiring Codes', desc: 'Set expiry dates so QR codes auto-deactivate after a deadline' },
        { icon: <HiOutlineLockClosed />, title: 'Password Protected', desc: 'Lock your QR codes with passwords for secure content access' },
        { icon: <HiOutlineBolt />, title: 'One-Time QR', desc: 'Single-use QR codes that invalidate after the first scan' },
        { icon: <HiOutlineShieldCheck />, title: 'Dynamic Redirect', desc: 'Short redirect links with real-time tracking and control' },
    ];

    return (
        <div className="landing">
            {/* Hero */}
            <section className="hero">
                <div className="container hero-container">
                    <div className="hero-glow" />
                    <div className="hero-content animate-fade-in-up">
                        <div className="hero-badge">✨ Next-Gen QR Platform</div>
                        <h1 className="hero-title">
                            Create <span className="hero-gradient-text">Smart QR Codes</span> in Seconds
                        </h1>
                        <p className="hero-subtitle">
                            Generate, manage, and track dynamic QR codes with expiry, passwords, one-time use, and real-time scan analytics.
                        </p>
                        <div className="hero-actions">
                            {user ? (
                                <Link to="/generate" className="btn btn-primary btn-lg">Generate QR Code</Link>
                            ) : (
                                <>
                                    <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
                                    <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hero-visual animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="hero-qr-mockup">
                            <div className="mockup-grid">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className={`mockup-cell ${i % 3 === 0 ? 'filled' : i % 2 === 0 ? 'filled' : ''}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features">
                <div className="container">
                    <h2 className="section-title">Everything You Need</h2>
                    <p className="section-subtitle">Powerful features to create, manage, and secure your QR codes</p>
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div key={i} className="feature-card card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta">
                <div className="container">
                    <div className="cta-card glass-card">
                        <h2>Ready to Create Your First Smart QR?</h2>
                        <p>Join QRIFY and start generating intelligent QR codes today.</p>
                        <Link to={user ? '/generate' : '/signup'} className="btn btn-primary btn-lg">
                            {user ? 'Go to Generator' : 'Sign Up — It\'s Free'}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
