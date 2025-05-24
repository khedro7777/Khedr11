const User = require("../models/User");
const Group = require("../models/Group");
const SupplierOffer = require("../models/SupplierOffer");
const FreelancerApplication = require("../models/FreelancerApplication");
const Arbitration = require("../models/Arbitration"); // Assuming Arbitration model exists

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGroups = await Group.countDocuments();
    const pendingGroups = await Group.countDocuments({ status: "pending_approval" });
    const activeGroups = await Group.countDocuments({ status: "active" });
    const totalSupplierOffers = await SupplierOffer.countDocuments();
    const pendingSupplierOffers = await SupplierOffer.countDocuments({ status: "pending" });
    const totalFreelancerApplications = await FreelancerApplication.countDocuments();
    const pendingFreelancerApplications = await FreelancerApplication.countDocuments({ status: "pending" });
    const totalArbitrationCases = await Arbitration.countDocuments();
    const pendingArbitrationCases = await Arbitration.countDocuments({ status: "pending" });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalGroups,
        pendingGroups,
        activeGroups,
        totalSupplierOffers,
        pendingSupplierOffers,
        totalFreelancerApplications,
        pendingFreelancerApplications,
        totalArbitrationCases,
        pendingArbitrationCases,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get groups pending approval
// @route   GET /api/admin/pending-groups
// @access  Private/Admin
exports.getPendingGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ status: "pending_approval" })
        .populate("creator", "username fullName email")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: groups.length, data: groups });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject group creation
// @route   PUT /api/admin/groups/:id/review
// @access  Private/Admin
exports.reviewGroup = async (req, res, next) => {
  try {
    const { status } = req.body; // Expecting 'approved' or 'rejected'

    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status provided (approved or rejected)" });
    }

    const group = await Group.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    res.status(200).json({ success: true, data: group });
  } catch (error) {
    next(error);
  }
};

// @desc    Get supplier offers pending review
// @route   GET /api/admin/pending-supplier-offers
// @access  Private/Admin
exports.getPendingSupplierOffers = async (req, res, next) => {
  try {
    const offers = await SupplierOffer.find({ status: "pending" })
        .populate("group", "name")
        .populate("supplier", "username fullName company")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: offers.length, data: offers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get freelancer applications pending review
// @route   GET /api/admin/pending-freelancer-applications
// @access  Private/Admin
exports.getPendingFreelancerApplications = async (req, res, next) => {
  try {
    const applications = await FreelancerApplication.find({ status: "pending" })
        .populate("group", "name")
        .populate("freelancer", "username fullName")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get arbitration cases pending review
// @route   GET /api/admin/pending-arbitration
// @access  Private/Admin
exports.getPendingArbitration = async (req, res, next) => {
  try {
    const cases = await Arbitration.find({ status: "pending" })
        .populate("group", "name")
        .populate("requester", "username fullName")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: cases.length, data: cases });
  } catch (error) {
    next(error);
  }
};

// Note: Review endpoints for Supplier Offers, Freelancer Applications, and Arbitration
// are already implemented in their respective controllers and routes.
// They are accessed via PUT /api/supplier-offers/:id/review, etc.
// We just need the GET routes here to list the pending items for the admin panel.
