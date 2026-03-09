const express = require('express');
const QRCode = require('qrcode');
const { nanoid } = require('nanoid');
const QR = require('../models/QRCode');
const protect = require('../middleware/auth');

const router = express.Router();

// Build the QR content string based on type
function buildQRContent(type, data) {
    switch (type) {
        case 'url':
            return data.url;
        case 'text':
            return data.text;
        case 'email':
            return `mailto:${data.email}?subject=${encodeURIComponent(data.subject || '')}&body=${encodeURIComponent(data.body || '')}`;
        case 'phone':
            return `tel:${data.phone}`;
        case 'wifi':
            return `WIFI:T:${data.encryption || 'WPA'};S:${data.ssid};P:${data.wifiPassword};H:${data.hidden ? 'true' : 'false'};;`;
        case 'vcard':
            return [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `FN:${data.fullName || ''}`,
                `TEL:${data.phone || ''}`,
                `EMAIL:${data.email || ''}`,
                `ORG:${data.organization || ''}`,
                `URL:${data.website || ''}`,
                'END:VCARD'
            ].join('\n');
        default:
            return data.text || data.url || '';
    }
}

// POST /api/qr/generate
router.post('/generate', protect, async (req, res) => {
    try {
        const { type, title, data, password, expiresAt, oneTime } = req.body;

        if (!type || !data) {
            return res.status(400).json({ message: 'Type and data are required' });
        }

        const content = buildQRContent(type, data);
        if (!content) {
            return res.status(400).json({ message: 'Invalid data for the selected QR type' });
        }

        const shortId = nanoid(8);
        const redirectUrl = `${req.protocol}://${req.get('host')}/r/${shortId}`;

        // For non-URL types, encode content directly; for URL types, use redirect
        const qrTarget = type === 'url' ? redirectUrl : redirectUrl;
        const qrDataUrl = await QRCode.toDataURL(qrTarget, {
            width: 400,
            margin: 2,
            color: { dark: '#000000', light: '#ffffff' }
        });

        const qrDoc = await QR.create({
            user: req.user._id,
            shortId,
            type,
            title: title || `${type.toUpperCase()} QR`,
            content,
            qrDataUrl,
            password: password || null,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            maxScans: oneTime ? 1 : null
        });

        res.status(201).json({
            message: 'QR Code generated successfully',
            qr: {
                id: qrDoc._id,
                shortId: qrDoc.shortId,
                type: qrDoc.type,
                title: qrDoc.title,
                qrDataUrl: qrDoc.qrDataUrl,
                redirectUrl,
                scanCount: qrDoc.scanCount,
                isPasswordProtected: qrDoc.isPasswordProtected,
                expiresAt: qrDoc.expiresAt,
                maxScans: qrDoc.maxScans,
                isActive: qrDoc.isActive,
                createdAt: qrDoc.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/qr/my-codes
router.get('/my-codes', protect, async (req, res) => {
    try {
        const qrCodes = await QR.find({ user: req.user._id })
            .select('-password')
            .sort({ createdAt: -1 });

        const host = `${req.protocol}://${req.get('host')}`;
        const enriched = qrCodes.map(qr => ({
            id: qr._id,
            shortId: qr.shortId,
            type: qr.type,
            title: qr.title,
            content: qr.content,
            qrDataUrl: qr.qrDataUrl,
            redirectUrl: `${host}/r/${qr.shortId}`,
            scanCount: qr.scanCount,
            maxScans: qr.maxScans,
            isPasswordProtected: qr.isPasswordProtected,
            expiresAt: qr.expiresAt,
            isActive: qr.isActive,
            isExpired: qr.isExpired(),
            createdAt: qr.createdAt
        }));

        res.json({ qrCodes: enriched });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/qr/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const qr = await QR.findOne({ _id: req.params.id, user: req.user._id });
        if (!qr) {
            return res.status(404).json({ message: 'QR Code not found' });
        }

        qr.isActive = false;
        await qr.save();

        res.json({ message: 'QR Code deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
