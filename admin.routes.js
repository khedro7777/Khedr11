const express = require("express");
const {
  getDashboardStats,
  getPendingGroups,
  reviewGroup,
  getPendingSupplierOffers,
  getPendingFreelancerApplications,
  getPendingArbitration
} = require("../controllers/admin.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

// All admin routes require admin or supervisor privileges
router.use(protect);
router.use(authorize("admin", "supervisor"));

// Admin routes
router.get("/dashboard", getDashboardStats);
router.get("/pending-groups", getPendingGroups);
router.put("/groups/:id/review", reviewGroup);
router.get("/pending-supplier-offers", getPendingSupplierOffers);
router.get("/pending-freelancer-applications", getPendingFreelancerApplications);
router.get("/pending-arbitration", getPendingArbitration);

// Note: Review endpoints for offers, applications, arbitration are handled in their respective routes
// e.g., PUT /api/supplier-offers/:id/review

module.exports = router;
