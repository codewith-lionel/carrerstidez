const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'University name is required'],
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  city: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  logo: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  ranking: {
    world: { type: Number, default: 0 },
    national: { type: Number, default: 0 },
    source: { type: String, default: '' },
  },
  type: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  establishedYear: {
    type: Number,
  },
  totalStudents: {
    type: Number,
    default: 0,
  },
  internationalStudents: {
    type: Number,
    default: 0,
  },
  acceptanceRate: {
    type: Number,
    default: 0,
  },
  tuitionFee: {
    undergraduate: { type: Number, default: 0 },
    postgraduate: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    period: { type: String, default: 'yearly' },
  },
  facilities: [{ type: String }],
  languages: [{ type: String }],
  isActive: {
    type: Boolean,
    default: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

universitySchema.index({ name: 'text', country: 'text', city: 'text' });
universitySchema.index({ country: 1 });
universitySchema.index({ 'ranking.world': 1 });

module.exports = mongoose.model('University', universitySchema);
