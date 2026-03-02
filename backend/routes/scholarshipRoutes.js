const express = require('express');
const router = express.Router();
const { createScholarship, getScholarships, getScholarship, updateScholarship, deleteScholarship } = require('../controllers/scholarshipController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getScholarships);
router.get('/:id', getScholarship);
router.post('/', protect, authorize('admin'), createScholarship);
router.put('/:id', protect, authorize('admin'), updateScholarship);
router.delete('/:id', protect, authorize('admin'), deleteScholarship);

module.exports = router;
