import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineQrCode, HiOutlineSquares2X2, HiOutlinePlusCircle, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import './Navbar.css';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="navbar-brand">
                    <HiOutlineQrCode className="brand-icon" />
                    <span className="brand-text">QRIFY</span>
                </Link>

                <div className="navbar-links">
                    {user ? (
                        <>
                            <Link to="/generate" className={`nav-link ${isActive('/generate') ? 'active' : ''}`}>
                                <HiOutlinePlusCircle />
                                <span>Generate</span>
                            </Link>
                            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                                <HiOutlineSquares2X2 />
                                <span>Dashboard</span>
                            </Link>
                            <div className="nav-user">
                                <span className="nav-user-name">{user.name}</span>
                                <button onClick={handleLogout} className="btn btn-secondary btn-sm" id="logout-btn">
                                    <HiOutlineArrowRightOnRectangle />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>Login</Link>
                            <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
