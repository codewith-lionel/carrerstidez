const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'jobseeker', 'student', 'recruiter'],
    default: 'jobseeker',
  },
  avatar: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: '',
  },
  skills: [{ type: String }],
  experience: {
    type: Number,
    default: 0,
  },
  education: [{
    degree: String,
    institution: String,
    year: Number,
    field: String,
  }],
  resume: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  company: {
    name: { type: String, default: '' },
    website: { type: String, default: '' },
    logo: { type: String, default: '' },
  },
  refreshToken: {
    type: String,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notificationPreferences: {
    email: { type: Boolean, default: true },
    jobAlerts: { type: Boolean, default: true },
    applicationUpdates: { type: Boolean, default: true },
  },
}, { timestamps: true });

userSchema.index({ role: 1 });
userSchema.index({ skills: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
