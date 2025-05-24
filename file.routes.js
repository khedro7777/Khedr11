const express = require("express");
const {
  uploadFile,
  getFile,
  deleteFile
} = require("../controllers/file.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

// File routes
router.post("/upload", protect, uploadFile); // Any authenticated user can upload
router.get("/:filename", getFile); // Public access for now, add protect/authorize if needed
router.delete("/:filename", protect, authorize("admin", "supervisor"), deleteFile); // Only admin/supervisor can delete for now

module.exports = router;
