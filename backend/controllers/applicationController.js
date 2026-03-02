const Application = require('../models/Application');
const Job = require('../models/Job');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { sendApplicationConfirmation, sendStatusUpdateEmail } = require('../services/emailService');

exports.applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Job not found or no longer active' });
    }
    const existing = await Application.findOne({ job: req.params.jobId, applicant: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied to this job' });
    }
    let resumeUrl = req.user.resume?.url || '';
    let resumePublicId = req.user.resume?.publicId || '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'resumes', 'raw');
      resumeUrl = result.secure_url;
      resumePublicId = result.public_id;
    }
    if (!resumeUrl) {
      return res.status(400).json({ success: false, message: 'Resume is required' });
    }
    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      coverLetter: req.body.coverLetter || '',
      resume: { url: resumeUrl, publicId: resumePublicId },
      expectedSalary: req.body.expectedSalary,
      availableFrom: req.body.availableFrom,
    });
    await Job.findByIdAndUpdate(req.params.jobId, { $inc: { applicantsCount: 1 } });
    await sendApplicationConfirmation(req.user.email, req.user.name, job.title, job.company.name);
    res.status(201).json({ success: true, data: application, message: 'Application submitted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location jobType salary status')
      .sort('-createdAt');
    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes, interviewDate } = req.body;
    const application = await Application.findById(req.params.id).populate('job applicant');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    const job = await Job.findOne({ _id: application.job._id, recruiter: req.user._id });
    if (!job) return res.status(403).json({ success: false, message: 'Unauthorized' });
    application.status = status;
    if (notes) application.notes = notes;
    if (interviewDate) application.interviewDate = interviewDate;
    await application.save();
    await sendStatusUpdateEmail(application.applicant.email, application.applicant.name, job.title, status);
    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

exports.withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, applicant: req.user._id });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    application.status = 'withdrawn';
    await application.save();
    res.json({ success: true, message: 'Application withdrawn' });
  } catch (error) {
    next(error);
  }
};
