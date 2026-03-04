const express = require("express");
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/auth");

// Removed upload middleware - applications now don't require file upload
router.post(
  "/jobs/:jobId",
  protect,
  authorize("jobseeker", "student"),
  applyToJob,
);
router.get("/my", protect, getMyApplications);
router.put(
  "/:id/status",
  protect,
  authorize("recruiter", "admin"),
  updateApplicationStatus,
);
router.put(
  "/:id/withdraw",
  protect,
  authorize("jobseeker", "student"),
  withdrawApplication,
);

module.exports = router;
