const FreelancerApplication = require('../models/FreelancerApplication');
const Group = require('../models/Group');
const User = require('../models/User');

// @desc    Get all open missions
// @route   GET /api/freelancer-applications/open-missions
// @access  Public
exports.getOpenMissions = async (req, res, next) => {
  try {
    // Find groups seeking freelancers
    const groups = await Group.find({
      status: { $in: ['approved', 'active'] },
      // This is a simplified approach - in a real app, you might have a specific field for freelancer needs
      resourceType: { $in: ['service', 'development', 'design'] }
    }).populate('creator', 'username fullName');
    
    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit freelancer application
// @route   POST /api/freelancer-applications
// @access  Private/Freelancer
exports.submitApplication = async (req, res, next) => {
  try {
    const { 
      group, 
      description, 
      timeline, 
      budget, 
      currency, 
      attachments 
    } = req.body;
    
    // Check if group exists
    const groupExists = await Group.findById(group);
    
    if (!groupExists) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }
    
    // Check if group is accepting applications
    if (!['approved', 'active'].includes(groupExists.status)) {
      return res.status(400).json({
        success: false,
        message: 'This group is not accepting applications at this time'
      });
    }
    
    // Create application
    const application = await FreelancerApplication.create({
      group,
      freelancer: req.user.id,
      description,
      timeline,
      budget,
      currency: currency || 'USD',
      attachments: attachments || [],
      status: 'pending'
    });
    
    // Add application to group's freelancerApplications
    await Group.findByIdAndUpdate(group, {
      $push: { freelancerApplications: application._id }
    });
    
    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get application details
// @route   GET /api/freelancer-applications/:id
// @access  Private
exports.getApplicationById = async (req, res, next) => {
  try {
    const application = await FreelancerApplication.findById(req.params.id)
      .populate('group', 'name description')
      .populate('freelancer', 'username fullName');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Check if user has access to this application
    const isFreelancer = application.freelancer._id.toString() === req.user.id;
    const isGroupMember = await Group.findOne({
      _id: application.group._id,
      'members.user': req.user.id
    });
    const isAdmin = ['admin', 'supervisor'].includes(req.user.role);
    
    if (!isFreelancer && !isGroupMember && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this application'
      });
    }
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all freelancer applications for a group
// @route   GET /api/groups/:id/freelancer-applications
// @access  Private
exports.getGroupApplications = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }
    
    // Check if user has access to this group
    const isMember = group.members.some(member => member.user.toString() === req.user.id);
    const isAdmin = ['admin', 'supervisor'].includes(req.user.role);
    
    if (!isMember && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this group\'s applications'
      });
    }
    
    const applications = await FreelancerApplication.find({ group: req.params.id })
      .populate('freelancer', 'username fullName');
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Review freelancer application
// @route   PUT /api/freelancer-applications/:id/review
// @access  Private/Admin
exports.reviewApplication = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status (approved or rejected)'
      });
    }
    
    let application = await FreelancerApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Update application status
    application = await FreelancerApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications submitted by current freelancer
// @route   GET /api/freelancer-applications/my
// @access  Private/Freelancer
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await FreelancerApplication.find({ freelancer: req.user.id })
      .populate('group', 'name description status');
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};
