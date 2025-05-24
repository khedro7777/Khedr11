const express = require('express');
const { 
  getOpenMissions, 
  submitApplication, 
  getApplicationById, 
  getGroupApplications, 
  reviewApplication, 
  getMyApplications 
} = require('../controllers/freelancerApplication.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Freelancer application routes
router.get('/open-missions', getOpenMissions);
router.post('/', protect, authorize('freelancer'), submitApplication);
router.get('/:id', protect, getApplicationById);
router.get('/group/:id', protect, getGroupApplications);
router.put('/:id/review', protect, authorize('admin', 'supervisor'), reviewApplication);
router.get('/my', protect, authorize('freelancer'), getMyApplications);

module.exports = router;
