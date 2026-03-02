const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  company: {
    name: { type: String, required: true },
    logo: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    country: { type: String, required: true },
    city: { type: String, default: '' },
    isRemote: { type: Boolean, default: false },
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  salary: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    period: { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly' },
  },
  experience: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 10 },
    level: { type: String, enum: ['entry', 'mid', 'senior', 'executive'], default: 'entry' },
  },
  skills: [{ type: String }],
  requirements: [{ type: String }],
  benefits: [{ type: String }],
  applicationDeadline: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active',
  },
  applicantsCount: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

jobSchema.index({ title: 'text', description: 'text', 'company.name': 'text' });
jobSchema.index({ 'location.country': 1 });
jobSchema.index({ industry: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ recruiter: 1 });
jobSchema.index({ skills: 1 });

module.exports = mongoose.model('Job', jobSchema);
