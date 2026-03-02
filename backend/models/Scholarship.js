const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Scholarship name is required'],
    trim: true,
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
  },
  country: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    value: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    type: { type: String, enum: ['full', 'partial', 'stipend'], default: 'partial' },
    coverage: [{ type: String }],
  },
  eligibility: {
    nationality: [{ type: String }],
    degree: [{ type: String, enum: ['UG', 'PG', 'Diploma', 'PhD', 'Certificate'] }],
    minGPA: { type: Number, default: 0 },
    other: [{ type: String }],
  },
  applicationDeadline: {
    type: Date,
  },
  applicationLink: {
    type: String,
    default: '',
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

scholarshipSchema.index({ name: 'text', country: 'text' });
scholarshipSchema.index({ country: 1 });
scholarshipSchema.index({ 'eligibility.degree': 1 });

module.exports = mongoose.model('Scholarship', scholarshipSchema);
