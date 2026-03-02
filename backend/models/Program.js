const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Program name is required'],
    trim: true,
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true,
  },
  degree: {
    type: String,
    enum: ['UG', 'PG', 'Diploma', 'PhD', 'Certificate'],
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  duration: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['months', 'years'], default: 'years' },
  },
  language: {
    type: String,
    default: 'English',
  },
  intakeDates: [{ type: String }],
  tuitionFee: {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    period: { type: String, default: 'yearly' },
  },
  requirements: {
    gpa: { type: Number, default: 0 },
    ielts: { type: Number, default: 0 },
    toefl: { type: Number, default: 0 },
    gre: { type: Number, default: 0 },
    gmat: { type: Number, default: 0 },
    other: [{ type: String }],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

programSchema.index({ name: 'text', field: 'text' });
programSchema.index({ university: 1 });
programSchema.index({ degree: 1 });
programSchema.index({ field: 1 });

module.exports = mongoose.model('Program', programSchema);
