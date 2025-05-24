const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../uploads"); // Store uploads in a top-level 'uploads' directory
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter (optional: restrict file types)
const fileFilter = (req, file, cb) => {
  // Accept images, pdfs, documents for now
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf" || file.mimetype.startsWith("application/msword") || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// Initialize Multer upload middleware
const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
}).single("file"); // Expecting a single file with field name 'file'

// @desc    Upload a file
// @route   POST /api/files/upload
// @access  Private
exports.uploadFile = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ success: false, message: `Multer error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
    }

    // Everything went fine.
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Return file information (e.g., path or URL)
    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`, // Relative path for client access (needs static serving)
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  });
};

// @desc    Get/Download a file
// @route   GET /api/files/:filename
// @access  Public (or Private with checks)
exports.getFile = (req, res, next) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../../uploads", filename);

    // Basic security check to prevent path traversal
    if (filename.includes("..")) {
        return res.status(400).json({ success: false, message: "Invalid filename" });
    }

    if (fs.existsSync(filePath)) {
      // Optional: Add access control logic here if files are private
      res.sendFile(filePath);
    } else {
      res.status(404).json({ success: false, message: "File not found" });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a file
// @route   DELETE /api/files/:filename
// @access  Private (Owner or Admin)
exports.deleteFile = (req, res, next) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../../uploads", filename);

    // Basic security check
    if (filename.includes("..")) {
        return res.status(400).json({ success: false, message: "Invalid filename" });
    }

    // Optional: Add ownership/permission check here before deleting
    // e.g., check if req.user.id matches the uploader stored in a database record for this file

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res.status(500).json({ success: false, message: "Error deleting file" });
        }
        res.status(200).json({ success: true, message: "File deleted successfully" });
      });
    } else {
      res.status(404).json({ success: false, message: "File not found" });
    }
  } catch (error) {
    next(error);
  }
};
