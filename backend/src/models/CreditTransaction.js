// src/models/CreditTransaction.js
// Immutable ledger entry for every community-credit movement. Every
// credit earned (teaching) or spent (learning) is recorded here with a
// balanceAfter snapshot, giving a full auditable transaction history
// and making it possible to reconstruct a user's balance at any point
// in time.

import mongoose from 'mongoose';

const { Schema } = mongoose;

const creditTransactionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['credit', 'debit'],
            required: [true, 'Transaction type is required'],
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [1, 'Amount must be at least 1'],
        },
        reason: {
            type: String,
            enum: [
                'session_teaching', // credit: earned by teaching a completed session
                'session_learning', // debit: spent by learning in a completed session
                'signup_bonus', // credit: starting balance on registration
                'admin_adjustment', // credit or debit: manual correction
                'refund', // credit: returned credits (e.g. cancelled session)
            ],
            required: [true, 'Transaction reason is required'],
        },
        relatedSchedule: {
            type: Schema.Types.ObjectId,
            ref: 'Schedule',
            default: null,
        },
        balanceAfter: {
            type: Number,
            required: true,
            min: [0, 'Balance cannot go negative'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [300, 'Description cannot exceed 300 characters'],
            default: '',
        },
    },
    { timestamps: true }
);

creditTransactionSchema.index({ user: 1, createdAt: -1 });

const CreditTransaction = mongoose.model('CreditTransaction', creditTransactionSchema);

export default CreditTransaction;