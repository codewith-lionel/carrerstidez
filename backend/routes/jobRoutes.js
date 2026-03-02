const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createJob, getJobs, getJob, updateJob, deleteJob, getMyJobs, getJobApplicants, getRecommendedJobs,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.get('/', getJobs);
router.get('/recommended', protect, authorize('jobseeker'), getRecommendedJobs);
router.get('/my-jobs', protect, authorize('recruiter', 'admin'), getMyJobs);
router.get('/:id', getJob);
router.get('/:id/applicants', protect, authorize('recruiter', 'admin'), getJobApplicants);

router.post('/', protect, authorize('recruiter', 'admin'), [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('company.name').notEmpty().withMessage('Company name is required'),
  body('location.country').notEmpty().withMessage('Country is required'),
  body('jobType').isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance']),
  body('industry').notEmpty().withMessage('Industry is required'),
], validate, createJob);

router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
