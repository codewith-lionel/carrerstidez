const express = require('express');
const router = express.Router();
const { createProgram, getPrograms, getProgram, updateProgram, deleteProgram } = require('../controllers/programController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getPrograms);
router.get('/:id', getProgram);
router.post('/', protect, authorize('admin'), createProgram);
router.put('/:id', protect, authorize('admin'), updateProgram);
router.delete('/:id', protect, authorize('admin'), deleteProgram);

module.exports = router;
