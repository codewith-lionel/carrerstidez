const Job = require('../models/Job');
const Application = require('../models/Application');

exports.createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, recruiter: req.user._id });
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

exports.getJobs = async (req, res, next) => {
  try {
    const { search, country, industry, jobType, experienceLevel, salaryMin, salaryMax, page = 1, limit = 10 } = req.query;
    const query = { status: 'active' };
    if (search) query.$text = { $search: search };
    if (country) query['location.country'] = { $regex: country, $options: 'i' };
    if (industry) query.industry = { $regex: industry, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query['experience.level'] = experienceLevel;
    if (salaryMin) query['salary.min'] = { $gte: Number(salaryMin) };
    if (salaryMax) query['salary.max'] = { $lte: Number(salaryMax) };
    const skip = (Number(page) - 1) * Number(limit);
    const [jobs, total] = await Promise.all([
      Job.find(query).populate('recruiter', 'name company').sort('-createdAt').skip(skip).limit(Number(limit)),
      Job.countDocuments(query),
    ]);
    res.json({
      success: true,
      data: jobs,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)), limit: Number(limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name company avatar');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    job.views += 1;
    await job.save();
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, recruiter: req.user._id });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found or unauthorized' });
    Object.assign(job, req.body);
    await job.save();
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, recruiter: req.user._id });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found or unauthorized' });
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort('-createdAt');
    res.json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
};

exports.getJobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, recruiter: req.user._id });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found or unauthorized' });
    const applications = await Application.find({ job: req.params.id }).populate('applicant', 'name email avatar skills experience resume');
    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

exports.getRecommendedJobs = async (req, res, next) => {
  try {
    const { getRecommendations } = require('../services/recommendationService');
    const recommendations = await getRecommendations(req.user);
    res.json({ success: true, data: recommendations });
  } catch (error) {
    next(error);
  }
};
