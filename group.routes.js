const express = require('express');
const { 
  createGroup, 
  getGroups, 
  getMyGroups, 
  getGroupById, 
  updateGroup, 
  joinGroup, 
  leaveGroup, 
  inviteToGroup, 
  getGroupMembers, 
  updateMemberRole 
} = require('../controllers/group.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Group routes
router.post('/', protect, createGroup);
router.get('/', getGroups);
router.get('/my', protect, getMyGroups);
router.get('/:id', getGroupById);
router.put('/:id', protect, updateGroup);
router.post('/:id/join', protect, joinGroup);
router.post('/:id/leave', protect, leaveGroup);
router.post('/:id/invite', protect, inviteToGroup);
router.get('/:id/members', protect, getGroupMembers);
router.put('/:id/members/:userId', protect, updateMemberRole);

module.exports = router;
