const express = require('express');
const router = express.Router();
const { saveJob, unsaveJob, getSavedJobs, saveProgram, unsaveProgram, getSavedPrograms } = require('../controllers/savedController');
const { protect } = require('../middleware/auth');

router.get('/jobs', protect, getSavedJobs);
router.post('/jobs/:jobId', protect, saveJob);
router.delete('/jobs/:jobId', protect, unsaveJob);
router.get('/programs', protect, getSavedPrograms);
router.post('/programs/:programId', protect, saveProgram);
router.delete('/programs/:programId', protect, unsaveProgram);

module.exports = router;
