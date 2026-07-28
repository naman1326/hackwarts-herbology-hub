// src/models/Skill.js
// A Skill document is a single listing created by a user — either
// something they can TEACH or something they WANT TO LEARN. This is
// the browsable/searchable/filterable entity behind the Skills API,
// distinct from the lightweight tag arrays on User (which exist purely
// to speed up matching queries).

import mongoose from 'mongoose';

const { Schema } = mongoose;

const SKILL_CATEGORIES = [
    'technology',
    'music',
    'art-and-craft',
    'cooking',
    'sports-and-fitness',
    'languages',
    'academics',
    'business',
    'wellness',
    'other',
];

const skillSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Skill must belong to a user'],
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Skill title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: SKILL_CATEGORIES,
                message: '{VALUE} is not a supported category',
            },
            lowercase: true,
            index: true,
        },
        type: {
            type: String,
            required: [true, 'Skill type is required'],
            enum: {
                values: ['teach', 'learn'],
                message: 'Type must be either "teach" or "learn"',
            },
            index: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        tags: {
            type: [String],
            default: [],
            set: (tags) => tags.map((t) => t.trim().toLowerCase()).filter(Boolean),
            index: true,
        },
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner',
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    { timestamps: true }
);

// ------------------------------------------------------------------
// INDEXES
// ------------------------------------------------------------------
// Full-text search across title, description, and tags
skillSchema.index({ title: 'text', description: 'text', tags: 'text' });
// Common browse/filter query shape: active skills of a given type/category
skillSchema.index({ type: 1, category: 1, isActive: 1 });

export const SKILL_CATEGORY_VALUES = SKILL_CATEGORIES;

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;