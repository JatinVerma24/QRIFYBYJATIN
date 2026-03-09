import { HiOutlineTrash, HiOutlineClipboardDocument, HiOutlineEye, HiOutlineLockClosed, HiOutlineClock } from 'react-icons/hi2';
import './QRCard.css';

export default function QRCard({ qr, onDelete, onCopyLink }) {
    const isExpired = qr.isExpired || (qr.expiresAt && new Date(qr.expiresAt) < new Date());
    const isMaxScans = qr.maxScans !== null && qr.scanCount >= qr.maxScans;
    const isInactive = !qr.isActive || isExpired || isMaxScans;

    return (
        <div className={`qr-card card ${isInactive ? 'qr-card-inactive' : ''}`}>
            <div className="qr-card-header">
                <div className="qr-card-badges">
                    <span className={`badge badge-${qr.type}`}>{qr.type}</span>
                    {qr.isPasswordProtected && <span className="badge badge-protected"><HiOutlineLockClosed /> Protected</span>}
                    {qr.maxScans === 1 && <span className="badge badge-onetime">One-Time</span>}
                    {isExpired && <span className="badge badge-expired">Expired</span>}
                    {!qr.isActive && <span className="badge badge-expired">Inactive</span>}
                </div>
            </div>

            <div className="qr-card-body">
                <div className="qr-card-image">
                    <img src={qr.qrDataUrl} alt={qr.title} />
                </div>
                <div className="qr-card-info">
                    <h3 className="qr-card-title">{qr.title}</h3>
                    <p className="qr-card-content">{qr.content.length > 50 ? qr.content.substring(0, 50) + '...' : qr.content}</p>
                    <div className="qr-card-stats">
                        <div className="stat">
                            <HiOutlineEye />
                            <span>{qr.scanCount} scans</span>
                        </div>
                        {qr.expiresAt && (
                            <div className="stat">
                                <HiOutlineClock />
                                <span>{new Date(qr.expiresAt).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="qr-card-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => onCopyLink(qr.redirectUrl)} title="Copy link">
                    <HiOutlineClipboardDocument /> Copy Link
                </button>
                <a href={qr.qrDataUrl} download={`${qr.title}.png`} className="btn btn-secondary btn-sm">
                    Download
                </a>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(qr.id)} title="Deactivate">
                    <HiOutlineTrash />
                </button>
            </div>
        </div>
    );
}
