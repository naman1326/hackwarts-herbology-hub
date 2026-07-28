// src/models/User.js
// Core user model. Holds authentication data, profile info, the
// denormalized skill-tag arrays used for fast matching, and the
// community-credit / trust-score fields that drive the rest of the app.
//
// Note on skillsCanTeach / skillsWantToLearn:
// These are lightweight, lowercase string tags kept on the user document
// so the matching engine can do a single fast query. The richer,
// browsable/searchable skill *listings* (with descriptions, category,
// level, etc.) live in the separate Skill model and reference this user.

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { env } from '../config/env.js';

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [80, 'Name cannot exceed 80 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
            index: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // never returned by default queries
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
            default: '',
        },
        profilePicture: {
            url: { type: String, default: '' },
            publicId: { type: String, default: '' }, // Cloudinary public_id, used for deletion/replacement
        },
        location: {
            city: { type: String, trim: true, default: '' },
            coordinates: {
                type: { type: String, enum: ['Point'], default: 'Point' },
                coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
            },
        },
        skillsCanTeach: {
            type: [String],
            default: [],
            set: (tags) => tags.map((t) => t.trim().toLowerCase()).filter(Boolean),
        },
        skillsWantToLearn: {
            type: [String],
            default: [],
            set: (tags) => tags.map((t) => t.trim().toLowerCase()).filter(Boolean),
        },
        availability: {
            // Free-form time-slot tags, e.g. ["weekday-evenings", "weekend-mornings"]
            type: [String],
            default: [],
        },
        credits: {
            type: Number,
            default: env.STARTING_CREDITS,
            min: [0, 'Credits cannot go negative'],
        },
        trustScore: {
            type: Number,
            default: 100,
            min: 0,
            max: 100,
        },
        completedSessions: {
            type: Number,
            default: 0,
            min: 0,
        },
        reviewsReceived: {
            type: Number,
            default: 0,
            min: 0,
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// ------------------------------------------------------------------
// INDEXES
// ------------------------------------------------------------------
userSchema.index({ 'location.coordinates': '2dsphere' });
userSchema.index({ skillsCanTeach: 1 });
userSchema.index({ skillsWantToLearn: 1 });
userSchema.index({ averageRating: -1, credits: -1, completedSessions: -1 }); // leaderboard sort support

// ------------------------------------------------------------------
// HOOKS
// ------------------------------------------------------------------
userSchema.pre('save', async function hashPassword(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ------------------------------------------------------------------
// INSTANCE METHODS
// ------------------------------------------------------------------
userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// ------------------------------------------------------------------
// JSON OUTPUT — strip sensitive/internal fields
// ------------------------------------------------------------------
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
    },
});

const User = mongoose.model('User', userSchema);

export default User;