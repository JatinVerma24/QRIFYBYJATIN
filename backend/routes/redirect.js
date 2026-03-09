const express = require('express');
const QR = require('../models/QRCode');

const router = express.Router();

// GET /r/:shortId — Public redirect / content delivery
router.get('/:shortId', async (req, res) => {
    try {
        const qr = await QR.findOne({ shortId: req.params.shortId });

        if (!qr) {
            return res.status(404).json({ message: 'QR Code not found' });
        }

        // Check if active
        if (!qr.isActive) {
            return res.status(410).json({ message: 'This QR Code has been deactivated' });
        }

        // Check expiry
        if (qr.isExpired()) {
            return res.status(410).json({ message: 'This QR Code has expired', expired: true });
        }

        // Check one-time / max scans
        if (qr.hasReachedMaxScans()) {
            return res.status(410).json({ message: 'This QR Code has reached its maximum scan limit', maxScansReached: true });
        }

        // Check password protection
        if (qr.isPasswordProtected) {
            return res.status(403).json({
                message: 'This QR Code is password protected',
                passwordRequired: true,
                shortId: qr.shortId,
                type: qr.type
            });
        }

        // Increment scan count
        qr.scanCount += 1;
        await qr.save();

        // Redirect for URL type, return content for others
        if (qr.type === 'url') {
            return res.redirect(qr.content);
        }

        res.json({
            type: qr.type,
            content: qr.content,
            title: qr.title
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /r/:shortId/verify — Verify password for protected QR
router.post('/:shortId/verify', async (req, res) => {
    try {
        const { password } = req.body;
        const qr = await QR.findOne({ shortId: req.params.shortId });

        if (!qr) {
            return res.status(404).json({ message: 'QR Code not found' });
        }

        if (!qr.isActive) {
            return res.status(410).json({ message: 'This QR Code has been deactivated' });
        }

        if (qr.isExpired()) {
            return res.status(410).json({ message: 'This QR Code has expired' });
        }

        if (qr.hasReachedMaxScans()) {
            return res.status(410).json({ message: 'This QR Code has reached its maximum scan limit' });
        }

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const isMatch = await qr.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Password correct — increment scan count
        qr.scanCount += 1;
        await qr.save();

        if (qr.type === 'url') {
            return res.json({ redirect: qr.content });
        }

        res.json({
            type: qr.type,
            content: qr.content,
            title: qr.title
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
