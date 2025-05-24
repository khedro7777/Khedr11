const Arbitration = require("../models/Arbitration"); // Assuming Arbitration model exists
const Group = require("../models/Group");

// @desc    Request arbitration
// @route   POST /api/arbitration
// @access  Private (Group Member)
exports.requestArbitration = async (req, res, next) => {
  try {
    const { group, disputeType, description, evidence, proposedAction } = req.body;

    // Check if group exists
    const groupExists = await Group.findById(group);
    if (!groupExists) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    // Check if user is a member of the group
    const isMember = groupExists.members.some(member => member.user.toString() === req.user.id);
    if (!isMember) {
        return res.status(403).json({ success: false, message: "Only group members can request arbitration" });
    }

    // Create arbitration request
    const arbitration = await Arbitration.create({
      group,
      requester: req.user.id,
      disputeType,
      description,
      evidence: evidence || [], // Assuming evidence is an array of file IDs or URLs
      proposedAction,
      status: "pending"
    });

    // Optionally freeze group activity
    // await Group.findByIdAndUpdate(group, { status: 'frozen', arbitrationActive: true });

    res.status(201).json({ success: true, data: arbitration });
  } catch (error) {
    next(error);
  }
};

// @desc    Get arbitration details
// @route   GET /api/arbitration/:id
// @access  Private (Involved Parties or Admin)
exports.getArbitrationById = async (req, res, next) => {
  try {
    const arbitration = await Arbitration.findById(req.params.id)
      .populate("group", "name members")
      .populate("requester", "username fullName")
      .populate("reviewer", "username fullName");

    if (!arbitration) {
      return res.status(404).json({ success: false, message: "Arbitration case not found" });
    }

    // Check access: requester, involved group member, or admin
    const group = await Group.findById(arbitration.group._id);
    const isMember = group.members.some(member => member.user.toString() === req.user.id);
    const isRequester = arbitration.requester._id.toString() === req.user.id;
    const isAdmin = ["admin", "supervisor"].includes(req.user.role);

    if (!isRequester && !isMember && !isAdmin) {
        return res.status(403).json({ success: false, message: "Not authorized to access this arbitration case" });
    }

    res.status(200).json({ success: true, data: arbitration });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all arbitration cases for a group
// @route   GET /api/groups/:id/arbitration
// @access  Private (Group Member or Admin)
exports.getGroupArbitrations = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    // Check access: group member or admin
    const isMember = group.members.some(member => member.user.toString() === req.user.id);
    const isAdmin = ["admin", "supervisor"].includes(req.user.role);

    if (!isMember && !isAdmin) {
        return res.status(403).json({ success: false, message: "Not authorized to access arbitration cases for this group" });
    }

    const arbitrations = await Arbitration.find({ group: req.params.id })
        .populate("requester", "username fullName")
        .populate("reviewer", "username fullName")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: arbitrations.length, data: arbitrations });
  } catch (error) {
    next(error);
  }
};

// @desc    Review/Update arbitration case
// @route   PUT /api/arbitration/:id/review
// @access  Private (Admin/Supervisor)
exports.reviewArbitration = async (req, res, next) => {
  try {
    const { status, resolution, notes } = req.body;
    const arbitrationId = req.params.id;

    if (!status || !["pending", "reviewing", "resolved", "rejected"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status provided" });
    }

    let arbitration = await Arbitration.findById(arbitrationId);

    if (!arbitration) {
      return res.status(404).json({ success: false, message: "Arbitration case not found" });
    }

    // Update case
    arbitration.status = status;
    arbitration.reviewer = req.user.id;
    if (resolution) arbitration.resolution = resolution;
    if (notes) arbitration.notes = notes; // Assuming a notes field exists in the model
    arbitration.reviewedAt = Date.now();

    await arbitration.save();

    // Optionally unfreeze group if resolved/rejected
    // if (["resolved", "rejected"].includes(status)) {
    //     await Group.findByIdAndUpdate(arbitration.group, { status: 'active', arbitrationActive: false });
    // }

    res.status(200).json({ success: true, data: arbitration });
  } catch (error) {
    next(error);
  }
};

// @desc    Freeze group activity
// @route   PUT /api/groups/:id/freeze
// @access  Private (Admin/Supervisor)
exports.freezeGroup = async (req, res, next) => {
    try {
        const group = await Group.findByIdAndUpdate(req.params.id, 
            { status: 'frozen', arbitrationActive: true }, 
            { new: true }
        );
        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }
        res.status(200).json({ success: true, message: "Group frozen successfully", data: group });
    } catch (error) {
        next(error);
    }
};

// @desc    Unfreeze group activity
// @route   PUT /api/groups/:id/unfreeze
// @access  Private (Admin/Supervisor)
exports.unfreezeGroup = async (req, res, next) => {
    try {
        const group = await Group.findByIdAndUpdate(req.params.id, 
            { status: 'active', arbitrationActive: false }, 
            { new: true }
        );
        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }
        res.status(200).json({ success: true, message: "Group unfrozen successfully", data: group });
    } catch (error) {
        next(error);
    }
};
