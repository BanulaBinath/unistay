const LaundryRequest = require('../models/LaundryRequest');
const User           = require('../Model/User');


// ─────────────────────────────────────────
//  STUDENT SIDE
// ─────────────────────────────────────────


// GET /api/laundry/vendors
exports.getLaundryVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor', vendorType: 'laundry', isActive: true })
      .select('fullName businessName phone address serviceType rates pickupHours isAvailable rating');
    res.json({ success: true, data: vendors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// POST /api/laundry/request
exports.createRequest = async (req, res) => {
  try {
    const { vendorId, service, quantity, pickupDate,
            hostelName, roomNumber, locationPin,
            specialNote, price } = req.body;

    const request = await LaundryRequest.create({
      student: req.user.userId,        // ✅ fixed
      vendor:  vendorId,
      service, quantity, pickupDate,
      hostelName, roomNumber, locationPin,
      specialNote, price
    });

    res.status(201).json({ success: true, message: 'Request submitted', data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/laundry/my-requests
exports.getStudentRequests = async (req, res) => {
  try {
    const requests = await LaundryRequest.find({ student: req.user.userId })  // ✅ fixed
      .populate('vendor', 'fullName businessName phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// PUT /api/laundry/request/:id/rate
exports.rateRequest = async (req, res) => {
  try {
    const { score, comment } = req.body;

    const request = await LaundryRequest.findOne({
      _id:     req.params.id,
      student: req.user.userId,        // ✅ fixed
      status:  'Completed'
    });

    if (!request)
      return res.status(404).json({ success: false, message: 'Request not found or not completed' });
    if (request.rating?.score)
      return res.status(400).json({ success: false, message: 'Already rated' });

    request.rating = { score, comment, createdAt: new Date() };
    await request.save();

    const ratedJobs = await LaundryRequest.find({
      vendor: request.vendor,
      'rating.score': { $exists: true }
    });
    const avg = ratedJobs.reduce((s, r) => s + r.rating.score, 0) / ratedJobs.length;
    await User.findByIdAndUpdate(request.vendor, { rating: parseFloat(avg.toFixed(1)) });

    res.json({ success: true, message: 'Rating submitted', data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// POST /api/laundry/request/:id/complaint
exports.createComplaint = async (req, res) => {
  try {
    const description = (req.body.description || '').trim();

    if (!description) {
      return res.status(400).json({ success: false, message: 'Complaint description is required' });
    }

    const request = await LaundryRequest.findOne({
      _id:     req.params.id,
      student: req.user.userId         // ✅ fixed
    });

    if (!request)
      return res.status(404).json({ success: false, message: 'Request not found' });

    request.complaint = { description, status: 'Pending', createdAt: new Date() };
    await request.save();

    res.json({ success: true, message: 'Complaint submitted', data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ─────────────────────────────────────────
//  VENDOR SIDE
// ─────────────────────────────────────────


// GET /api/laundry/vendor/profile
exports.getVendorProfile = async (req, res) => {
  try {
    const vendor = await User.findById(req.user.userId).select('-password');  // ✅ fixed
    if (!vendor)
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, data: vendor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// PUT /api/laundry/vendor/profile
exports.updateVendorProfile = async (req, res) => {
  try {
    const { fullName, businessName, phone, address,
            experience, about, serviceType, rates, pickupHours } = req.body;

    const vendor = await User.findById(req.user.userId);  // ✅ fixed
    if (!vendor)
      return res.status(404).json({ success: false, message: 'Vendor not found' });

    if (fullName)     vendor.fullName     = fullName;
    if (businessName) vendor.businessName = businessName;
    if (phone)        vendor.phone        = phone;
    if (address)      vendor.address      = address;
    if (experience)   vendor.experience   = experience;
    if (about)        vendor.about        = about;
    if (serviceType)  vendor.serviceType  = serviceType;
    if (pickupHours)  vendor.pickupHours  = pickupHours;
    if (rates)        vendor.rates        = rates;

    vendor.markModified('rates');
    vendor.markModified('serviceType');
    vendor.markModified('pickupHours');

    await vendor.save();

    const updated = await User.findById(req.user.userId).select('-password');  // ✅ fixed
    res.json({ success: true, message: 'Profile updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// PUT /api/laundry/vendor/availability
exports.updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const vendor = await User.findByIdAndUpdate(
      req.user.userId,                 // ✅ fixed
      { isAvailable },
      { new: true }
    ).select('isAvailable fullName');
    res.json({ success: true, message: 'Availability updated', data: vendor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/laundry/vendor/stats
exports.getVendorStats = async (req, res) => {
  try {
    const vendorId = req.user.userId;  // ✅ fixed
    const [total, pending, inProgress, completed, ratedJobs] = await Promise.all([
      LaundryRequest.countDocuments({ vendor: vendorId }),
      LaundryRequest.countDocuments({ vendor: vendorId, status: 'Pending' }),
      LaundryRequest.countDocuments({ vendor: vendorId, status: 'In Progress' }),
      LaundryRequest.countDocuments({ vendor: vendorId, status: 'Completed' }),
      LaundryRequest.find({ vendor: vendorId, 'rating.score': { $exists: true } })
    ]);

    const averageRating = ratedJobs.length
      ? parseFloat(
          (ratedJobs.reduce((s, r) => s + r.rating.score, 0) / ratedJobs.length).toFixed(1)
        )
      : null;

    res.json({
      success: true,
      data: {
        totalJobs: total,
        pendingJobs: pending,
        inProgressJobs: inProgress,
        completedJobs: completed,
        averageRating
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/laundry/vendor/jobs
exports.getVendorJobs = async (req, res) => {
  try {
    const jobs = await LaundryRequest.find({ vendor: req.user.userId })  // ✅ fixed
      .populate('student', 'fullName email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// PUT /api/laundry/vendor/jobs/:id/status
exports.updateJobStatus = async (req, res) => {
  try {
    const { status, completionNote, cancelReason } = req.body;
    const job = await LaundryRequest.findOne({
      _id:    req.params.id,
      vendor: req.user.userId          // ✅ fixed
    });

    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    job.status = status;
    if (completionNote) job.completionNote = completionNote;
    if (cancelReason)   job.cancelReason   = cancelReason;
    await job.save();

    res.json({ success: true, message: 'Status updated', data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/laundry/vendor/ratings
exports.getVendorRatings = async (req, res) => {
  try {
    const jobs = await LaundryRequest.find({
      vendor:         req.user.userId, // ✅ fixed
      status:         'Completed',
      'rating.score': { $exists: true }
    }).populate('student', 'fullName');
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/laundry/vendor/complaints
exports.getVendorComplaints = async (req, res) => {
  try {
    const complaints = await LaundryRequest.find({
      vendor: req.user.userId,  // ✅ fixed
      complaint: { $exists: true, $ne: null }
    }).populate('student', 'fullName');
    res.json({ success: true, data: complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// PUT /api/laundry/vendor/complaints/:id/reply
exports.replyToComplaint = async (req, res) => {
  try {
    const { vendorReply, reply } = req.body;
    const replyMessage = vendorReply || reply;

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ success: false, message: 'Reply text is required' });
    }

    const job = await LaundryRequest.findOne({
      _id:    req.params.id,
      vendor: req.user.userId          // ✅ fixed
    });

    if (!job || !job.complaint?.description)
      return res.status(404).json({ success: false, message: 'Complaint not found' });

    job.complaint.vendorReply = replyMessage;
    job.complaint.status      = 'Resolved';
    await job.save();

    res.json({ success: true, message: 'Reply sent', data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};