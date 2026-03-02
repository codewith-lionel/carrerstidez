const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsers, toggleUserStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));
router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);

module.exports = router;
