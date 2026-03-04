const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getUsers, toggleUserStatus,
  getAllJobs, deleteJobAdmin, toggleJobStatus,
  getAllUniversitiesAdmin, getAllProgramsAdmin, getAllScholarshipsAdmin,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);

// Jobs
router.get('/jobs', getAllJobs);
router.delete('/jobs/:id', deleteJobAdmin);
router.patch('/jobs/:id/toggle-status', toggleJobStatus);

// Universities / Programs / Scholarships
router.get('/universities', getAllUniversitiesAdmin);
router.get('/programs', getAllProgramsAdmin);
router.get('/scholarships', getAllScholarshipsAdmin);

module.exports = router;
