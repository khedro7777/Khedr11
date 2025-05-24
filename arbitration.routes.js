const express = require("express");
const {
  requestArbitration,
  getArbitrationById,
  getGroupArbitrations,
  reviewArbitration,
  freezeGroup, // Assuming these are part of arbitration flow control
  unfreezeGroup // Assuming these are part of arbitration flow control
} = require("../controllers/arbitration.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

// Arbitration routes
router.post("/", protect, requestArbitration); // Group Member
router.get("/:id", protect, getArbitrationById); // Involved Parties or Admin
router.put("/:id/review", protect, authorize("admin", "supervisor"), reviewArbitration); // Admin/Supervisor

// Routes for group-specific arbitration cases (better placed under groups: GET /api/groups/:groupId/arbitration)
router.get("/group/:groupId", protect, getGroupArbitrations); // Group Member or Admin

// Routes for freezing/unfreezing groups (might be better under admin or group routes)
router.put("/groups/:id/freeze", protect, authorize("admin", "supervisor"), freezeGroup);
router.put("/groups/:id/unfreeze", protect, authorize("admin", "supervisor"), unfreezeGroup);

module.exports = router;
