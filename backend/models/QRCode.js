const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const qrCodeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shortId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ['url', 'text', 'email', 'phone', 'wifi', 'vcard']
    },
    title: {
        type: String,
        default: 'Untitled QR'
    },
    content: {
        type: String,
        required: true
    },
    qrDataUrl: {
        type: String,
        required: true
    },
    scanCount: {
        type: Number,
        default: 0
    },
    maxScans: {
        type: Number,
        default: null   // null = unlimited, 1 = one-time
    },
    password: {
        type: String,
        default: null
    },
    isPasswordProtected: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash QR password before saving
qrCodeSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.isPasswordProtected = true;
    next();
});

// Compare QR password
qrCodeSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

// Check if QR is expired
qrCodeSchema.methods.isExpired = function () {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
};

// Check if QR has reached max scans
qrCodeSchema.methods.hasReachedMaxScans = function () {
    if (this.maxScans === null) return false;
    return this.scanCount >= this.maxScans;
};

module.exports = mongoose.model('QRCode', qrCodeSchema);
