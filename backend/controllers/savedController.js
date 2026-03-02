const SavedJob = require('../models/SavedJob');
const SavedProgram = require('../models/SavedProgram');

exports.saveJob = async (req, res, next) => {
  try {
    const saved = await SavedJob.create({ user: req.user._id, job: req.params.jobId });
    res.status(201).json({ success: true, data: saved, message: 'Job saved successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Job already saved' });
    }
    next(error);
  }
};

exports.unsaveJob = async (req, res, next) => {
  try {
    await SavedJob.findOneAndDelete({ user: req.user._id, job: req.params.jobId });
    res.json({ success: true, message: 'Job removed from saved' });
  } catch (error) {
    next(error);
  }
};

exports.getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id }).populate('job').sort('-createdAt');
    res.json({ success: true, data: savedJobs });
  } catch (error) {
    next(error);
  }
};

exports.saveProgram = async (req, res, next) => {
  try {
    const saved = await SavedProgram.create({ user: req.user._id, program: req.params.programId });
    res.status(201).json({ success: true, data: saved, message: 'Program saved successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Program already saved' });
    }
    next(error);
  }
};

exports.unsaveProgram = async (req, res, next) => {
  try {
    await SavedProgram.findOneAndDelete({ user: req.user._id, program: req.params.programId });
    res.json({ success: true, message: 'Program removed from saved' });
  } catch (error) {
    next(error);
  }
};

exports.getSavedPrograms = async (req, res, next) => {
  try {
    const savedPrograms = await SavedProgram.find({ user: req.user._id }).populate({ path: 'program', populate: { path: 'university', select: 'name country logo' } }).sort('-createdAt');
    res.json({ success: true, data: savedPrograms });
  } catch (error) {
    next(error);
  }
};
