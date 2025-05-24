const Group = require('../models/Group');
const User = require('../models/User');

// @desc    Create new group
// @route   POST /api/groups
// @access  Private
exports.createGroup = async (req, res, next) => {
  try {
    const { name, description, sector, country, expectedMembers, resourceType } = req.body;
    
    // Create group
    const group = await Group.create({
      name,
      description,
      creator: req.user.id,
      sector,
      country,
      expectedMembers,
      resourceType,
      members: [{ user: req.user.id, role: 'creator', joinedAt: Date.now() }],
      status: 'pending_approval'
    });
    
    // Add group to user's createdGroups
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdGroups: group._id }
    });
    
    res.status(201).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all groups
// @route   GET /api/groups
// @access  Public
exports.getGroups = async (req, res, next) => {
  try {
    const { sector, country, status, resourceType } = req.query;
    const filter = {};
    
    if (sector) filter.sector = sector;
    if (country) filter.country = country;
    if (status) filter.status = status;
    if (resourceType) filter.resourceType = resourceType;
    
    // Only show approved or active groups to public
    if (!req.user || !['admin', 'supervisor'].includes(req.user.role)) {
      filter.status = { $in: ['approved', 'active'] };
    }
    
    const groups = await Group.find(filter)
      .populate('creator', 'username fullName')
      .populate('members.user', 'username fullName');
    
    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get groups created or joined by current user
// @route   GET /api/groups/my
// @access  Private
exports.getMyGroups = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('createdGroups')
      .populate('joinedGroups');
    
    res.status(200).json({
      success: true,
      createdGroups: user.createdGroups || [],
      joinedGroups: user.joinedGroups || []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get group by ID
// @route   GET /api/groups/:id
// @access  Public/Private (depends on group status)
exports.getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator', 'username fullName')
      .populate('members.user', 'username fullName')
      .populate('supplierOffers')
      .populate('freelancerApplications');
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }
    
    // Check if group is public or user has access
    const isPublic = ['approved', 'active'].includes(group.status);
    const isMember = req.user && group.members.some(member => member.user._id.toString() === req.user.id);
    const isAdmin = req.user && ['admin', 'supervisor'].includes(req.user.role);
    
    if (!isPublic && !isMember && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this group'
      });
    }
    
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update group
// @route   PUT /api/groups/:id
// @access  Private (creator or admin only)
exports.updateGroup = async (req, res, next) => {
  try {
    let group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }
    
    // Check if user is creator or admin
    const isCreator = group.creator.toString() === req.user.id;
    const isAdmin = ['admin', 'supervisor'].includes(req.user.role);
    const isGroupAdmin = group.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    if (!isCreator && !isAdmin && !isGroupAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this group'
      });
    }
    
    // Update group
    group = await Group.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join group
// @route   POST /api/groups/:id/join
// @access  Private
exports.joinGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }
    
    // Check if group is joinable
    if (!['approved', 'active'].includes(group.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot join this group at this time'
      });
    }
    
    // Check if user is already a member
    if (group.members.some(member => member.user.toString() === req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Already a member of this group'
      });
    }
    
    // Add user to group members
    group.members.push({
      user: req.user.id,
      role: 'member',
      joinedAt: Date.now()
    });
    
    await group.save();
    
    // Add group to user's joinedGroups
    await User.findByIdAndUpdate(req.user.id, {
      $push: { joinedGroups: group._id }
    });
    
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave group
// @route   POST /api/groups/:id/leave
// @access  Private
exports.leaveGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }
    
    // Check if user is a member
    if (!group.members.some(member => member.user.toString() === req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Not a member of this group'
      });
    }
    
    // Check if user is the creator
    if (group.creator.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Creator cannot leave the group'
      });
    }
    
    // Remove user from group members
    group.members = group.members.filter(
      member => member.user.toString() !== req.user.id
    );
    
    await group.save();
    
    // Remove group from user's joinedGroups
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { joinedGroups: group._id }
    });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Invite user to group
// @route   POST /api/groups/:id/invite
// @access  Private (creator or admin only)
exports.inviteToGroup = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email'
      });
    }
    
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }
    
    // Check if user is creator or admin
    const isCreator = group.creator.toString() === req.user.id;
    const isAdmin = ['admin', 'supervisor'].includes(req.user.role);
    const isGroupAdmin = group.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    if (!isCreator && !isAdmin && !isGroupAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to invite users to this group'
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user is already a member
    if (group.members.some(member => member.user.toString() === user._id.toString())) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this group'
      });
    }
    
    // Add user to group members
    group.members.push({
      user: user._id,
      role: 'member',
      joinedAt: Date.now()
    });
    
    await group.save();
    
    // Add group to user's joinedGroups
    await User.findByIdAndUpdate(user._id, {
      $push: { joinedGroups: group._id }
    });
    
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get group members
// @route   GET /api/groups/:id/members
// @access  Private
exports.getGroupMembers = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members.user', 'username fullName email profileImage');
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }
    
    res.status(200).json({
      success: true,
      count: group.members.length,
      data: group.members
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member role
// @route   PUT /api/groups/:id/members/:userId
// @access  Private (creator or admin only)
exports.updateMemberRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    
    if (!role || !['member', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid role (member or admin)'
      });
    }
    
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }
    
    // Check if user is creator or admin
    const isCreator = group.creator.toString() === req.user.id;
    const isAdmin = ['admin', 'supervisor'].includes(req.user.role);
    
    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update member roles'
      });
    }
    
    // Find member
    const memberIndex = group.members.findIndex(
      member => member.user.toString() === req.params.userId
    );
    
    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }
    
    // Cannot change creator's role
    if (group.creator.toString() === req.params.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change creator\'s role'
      });
    }
    
    // Update member role
    group.members[memberIndex].role = role;
    
    await group.save();
    
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};
