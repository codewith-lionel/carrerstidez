const express = require('express');
const router = express.Router();
const { getCareerAdvice } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// Require login to use AI advisor
router.post('/career-advice', protect, getCareerAdvice);

module.exports = router;
