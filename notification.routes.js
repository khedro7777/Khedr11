const express = require("express");
const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} = require("../controllers/notification.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// Notification routes
router.get("/", getNotifications);
router.put("/:id/read", markNotificationRead);
router.put("/read-all", markAllNotificationsRead);

module.exports = router;
