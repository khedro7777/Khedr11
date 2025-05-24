const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// OTP storage (in-memory for development, should use Redis or similar in production)
const otpStore = new Map();

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
  port: process.env.EMAIL_PORT || 2525,
  auth: {
    user: process.env.EMAIL_USER || 'your_mailtrap_user',
    pass: process.env.EMAIL_PASS || 'your_mailtrap_password'
  }
});

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Generate OTP
const generateOTP = () => {
  return otpGenerator.generate(6, { 
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true
  });
};

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@gpo-saas.com',
    to: email,
    subject: 'Your GPO SaaS Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">GPO SaaS Platform</h2>
        <p style="font-size: 16px; color: #555;">Hello,</p>
        <p style="font-size: 16px; color: #555;">Your verification code is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #777;">This code will expire in 10 minutes.</p>
        <p style="font-size: 14px; color: #777;">If you didn't request this code, please ignore this email.</p>
        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          &copy; ${new Date().getFullYear()} GPO SaaS Platform. All rights reserved.
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Store OTP with expiration
const storeOTP = (email, otp, purpose) => {
  // Set expiration time (10 minutes)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  
  // Store OTP with purpose (register or login)
  otpStore.set(email, {
    otp,
    purpose,
    expiresAt,
    attempts: 0
  });
};

// Verify OTP
const verifyOTP = (email, otp, purpose) => {
  const otpData = otpStore.get(email);
  
  // Check if OTP exists
  if (!otpData) {
    return { valid: false, message: 'No verification code found. Please request a new one.' };
  }
  
  // Check if OTP is expired
  if (new Date() > otpData.expiresAt) {
    otpStore.delete(email);
    return { valid: false, message: 'Verification code has expired. Please request a new one.' };
  }
  
  // Check if purpose matches
  if (otpData.purpose !== purpose) {
    return { valid: false, message: 'Invalid verification code.' };
  }
  
  // Increment attempts
  otpData.attempts += 1;
  
  // Check if max attempts reached (5 attempts)
  if (otpData.attempts > 5) {
    otpStore.delete(email);
    return { valid: false, message: 'Too many failed attempts. Please request a new code.' };
  }
  
  // Check if OTP matches
  if (otpData.otp !== otp) {
    otpStore.set(email, otpData); // Update attempts
    return { valid: false, message: 'Invalid verification code.' };
  }
  
  // OTP is valid, remove it from store
  otpStore.delete(email);
  return { valid: true };
};

// Rate limiting for OTP requests (simple in-memory implementation)
const otpRequestLimiter = new Map();

const checkRateLimit = (email) => {
  const now = Date.now();
  const windowMs = 30 * 60 * 1000; // 30 minutes
  const maxRequests = 3; // Max 3 requests per window
  
  if (!otpRequestLimiter.has(email)) {
    otpRequestLimiter.set(email, [now]);
    return true;
  }
  
  const requests = otpRequestLimiter.get(email);
  const windowStart = now - windowMs;
  
  // Filter out requests older than the window
  const recentRequests = requests.filter(time => time > windowStart);
  
  // Check if max requests reached
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  // Add current request time
  recentRequests.push(now);
  otpRequestLimiter.set(email, recentRequests);
  return true;
};

// @desc    Request OTP for registration or login
// @route   POST /api/auth/request-otp
// @access  Public
exports.requestOTP = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;
    
    // Validate purpose
    if (!['register', 'login'].includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid purpose specified'
      });
    }
    
    // Check rate limit
    if (!checkRateLimit(email)) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again later.'
      });
    }
    
    // For registration, check if user already exists
    if (purpose === 'register') {
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
    }
    
    // For login, check if user exists
    if (purpose === 'login') {
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account found with this email'
        });
      }
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP
    storeOTP(email, otp, purpose);
    
    // Send OTP via email
    await sendOTPEmail(email, otp);
    
    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email',
      expiresIn: '10 minutes'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and register user
// @route   POST /api/auth/verify-otp-register
// @access  Public
exports.verifyOTPAndRegister = async (req, res, next) => {
  try {
    const { email, otp, username, fullName, role, country, sector, company } = req.body;
    
    // Verify OTP
    const verification = verifyOTP(email, otp, 'register');
    
    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message
      });
    }
    
    // Create user
    const user = await User.create({
      username: username || email.split('@')[0],
      email,
      password: Math.random().toString(36).slice(-10), // Generate random password for OTP users
      fullName,
      role: role || 'buyer',
      country,
      sector,
      company
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        country: user.country,
        sector: user.sector,
        company: user.company
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and login user
// @route   POST /api/auth/verify-otp-login
// @access  Public
exports.verifyOTPAndLogin = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    // Verify OTP
    const verification = verifyOTP(email, otp, 'login');
    
    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message
      });
    }
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        country: user.country,
        sector: user.sector,
        company: user.company
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register user (traditional password method)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, fullName, role, country, sector, company } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }
    
    // Create user
    const user = await User.create({
      username,
      email,
      password,
      fullName,
      role: role || 'buyer',
      country,
      sector,
      company
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        country: user.country,
        sector: user.sector,
        company: user.company
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (traditional password method)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        country: user.country,
        sector: user.sector,
        company: user.company
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
