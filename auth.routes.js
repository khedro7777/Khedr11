const express = require('express');
const { 
  register, 
  login, 
  getMe, 
  requestOTP, 
  verifyOTPAndRegister, 
  verifyOTPAndLogin 
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Traditional auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// OTP-based auth routes
router.post('/request-otp', requestOTP);
router.post('/verify-otp-register', verifyOTPAndRegister);
router.post('/verify-otp-login', verifyOTPAndLogin);

module.exports = router;
