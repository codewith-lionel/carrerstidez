const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const University = require('../models/University');
const Program = require('../models/Program');
const Scholarship = require('../models/Scholarship');

// ── Job Management ─────────────────────────────────────────────────────────────
exports.getAllJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.$text = { $search: search };
    const skip = (Number(page) - 1) * Number(limit);
    const [jobs, total] = await Promise.all([
      Job.find(query).populate('recruiter', 'name email').sort('-createdAt').skip(skip).limit(Number(limit)),
      Job.countDocuments(query),
    ]);
    res.json({ success: true, data: jobs, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    next(error);
  }
};

exports.deleteJobAdmin = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    next(error);
  }
};

exports.toggleJobStatus = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    job.status = job.status === 'active' ? 'closed' : 'active';
    await job.save({ validateBeforeSave: false });
    res.json({ success: true, data: job, message: `Job ${job.status}` });
  } catch (error) {
    next(error);
  }
};

// ── University/Program/Scholarship Management ──────────────────────────────────
exports.getAllUniversitiesAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    const skip = (Number(page) - 1) * Number(limit);
    const [universities, total] = await Promise.all([
      University.find(query).sort('-createdAt').skip(skip).limit(Number(limit)),
      University.countDocuments(query),
    ]);
    res.json({ success: true, data: universities, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    next(error);
  }
};

exports.getAllProgramsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    const skip = (Number(page) - 1) * Number(limit);
    const [programs, total] = await Promise.all([
      Program.find(query).populate('university', 'name country').sort('-createdAt').skip(skip).limit(Number(limit)),
      Program.countDocuments(query),
    ]);
    res.json({ success: true, data: programs, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    next(error);
  }
};

exports.getAllScholarshipsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    const skip = (Number(page) - 1) * Number(limit);
    const [scholarships, total] = await Promise.all([
      Scholarship.find(query).sort('-createdAt').skip(skip).limit(Number(limit)),
      Scholarship.countDocuments(query),
    ]);
    res.json({ success: true, data: scholarships, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalJobs,
      totalApplications,
      totalUniversities,
      totalPrograms,
      totalScholarships,
      recentUsers,
      recentJobs,
    ] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      University.countDocuments(),
      Program.countDocuments(),
      Scholarship.countDocuments(),
      User.find().sort('-createdAt').limit(5).select('name email role createdAt'),
      Job.find().sort('-createdAt').limit(5).select('title company status createdAt'),
    ]);
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);
    const jobsByStatus = await Job.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    res.json({
      success: true,
      data: {
        stats: { totalUsers, totalJobs, totalApplications, totalUniversities, totalPrograms, totalScholarships },
        charts: { usersByRole, jobsByStatus, applicationsByStatus },
        recent: { recentUsers, recentJobs },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = role ? { role } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).sort('-createdAt').skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);
    res.json({ success: true, data: users, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    next(error);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, data: user, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (error) {
    next(error);
  }
};
