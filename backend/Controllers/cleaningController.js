const CleaningRequest = require('../models/CleaningRequest');
const User            = require('../Model/User');


// ─────────────────────────────────────────
//  STUDENT SIDE
// ─────────────────────────────────────────


// GET /api/cleaning/vendors
exports.getCleaningVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor', vendorType: 'cleaning', isActive: true })
      .select('fullName businessName email phone address serviceType rates isAvailable rating profileImage');
    res.json({ success: true, data: vendors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// POST /api/cleaning/request
exports.createRequest = async (req, res) => {
  try {
    const { vendorId, serviceType, hostelName, roomNumber,
            requestDate, timeSlot, specialNote, locationPin, price } = req.body;

    const request = await CleaningRequest.create({
      student:     req.user.userId,    // ✅ fixed
      vendor:      vendorId,
      serviceType, hostelName, roomNumber,
      requestDate, timeSlot, specialNote, locationPin, price
    });

    res.status(201).json({ success: true, message: 'Cleaning request submitted', data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/cleaning/my-requests
exports.getStudentRequests = async (req, res) => {
  try {
    const requests = await CleaningRequest.find({ student: req.user.userId })  // ✅ fixed
      .populate('vendor', 'fullName businessName phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// PUT /api/cleaning/request/:id/rate
exports.rateRequest = async (req, res) => {
  try {
    const { score, comment } = req.body;

    const request = await CleaningRequest.findOne({
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

    const ratedJobs = await CleaningRequest.find({
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


// POST /api/cleaning/request/:id/complaint
exports.createComplaint = async (req, res) => {
  try {
    const { description } = req.body;

    const request = await CleaningRequest.findOne({
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


// GET /api/cleaning/vendor/profile
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


// PUT /api/cleaning/vendor/profile
exports.updateVendorProfile = async (req, res) => {
  try {
    const { fullName, businessName, phone, address,
            experience, about, serviceType, rates } = req.body;

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
    if (rates) {
      vendor.rates = typeof rates === 'string' ? JSON.parse(rates) : rates;
    }
    if (req.file) {
      vendor.profileImage = `/uploads/${req.file.filename}`;
    }

    vendor.markModified('rates');
    vendor.markModified('serviceType');

    await vendor.save();

    const updated = await User.findById(req.user.userId).select('-password');  // ✅ fixed
    res.json({ success: true, message: 'Profile updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// PUT /api/cleaning/vendor/availability
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


// GET /api/cleaning/vendor/stats
exports.getVendorStats = async (req, res) => {
  try {
    const vendorId = req.user.userId;  // ✅ fixed
    const [total, pending, completed, ratedJobs] = await Promise.all([
      CleaningRequest.countDocuments({ vendor: vendorId }),
      CleaningRequest.countDocuments({ vendor: vendorId, status: 'Pending' }),
      CleaningRequest.countDocuments({ vendor: vendorId, status: 'Completed' }),
      CleaningRequest.find({ vendor: vendorId, 'rating.score': { $exists: true } })
    ]);

    const averageRating = ratedJobs.length
      ? parseFloat(
          (ratedJobs.reduce((s, r) => s + r.rating.score, 0) / ratedJobs.length).toFixed(1)
        )
      : null;

    res.json({
      success: true,
      data: { totalJobs: total, pendingJobs: pending, completedJobs: completed, averageRating }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/cleaning/vendor/jobs
exports.getVendorJobs = async (req, res) => {
  try {
    const jobs = await CleaningRequest.find({ vendor: req.user.userId })  // ✅ fixed
      .populate('student', 'fullName email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// PUT /api/cleaning/vendor/jobs/:id/status
exports.updateJobStatus = async (req, res) => {
  try {
    const { status, completionNote, cancelReason } = req.body;

    const job = await CleaningRequest.findOne({
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


// GET /api/cleaning/vendor/ratings
exports.getVendorRatings = async (req, res) => {
  try {
    const jobs = await CleaningRequest.find({
      vendor:         req.user.userId, // ✅ fixed
      status:         'Completed',
      'rating.score': { $exists: true }
    }).populate('student', 'fullName');
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/cleaning/vendor/complaints
exports.getVendorComplaints = async (req, res) => {
  try {
    const complaints = await CleaningRequest.find({
      vendor:                  req.user.userId,  // ✅ fixed
      'complaint.description': { $exists: true, $ne: '' }
    }).populate('student', 'fullName');
    res.json({ success: true, data: complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// PUT /api/cleaning/vendor/complaints/:id/reply
exports.replyToComplaint = async (req, res) => {
  try {
    const { vendorReply } = req.body;

    const job = await CleaningRequest.findOne({
      _id:    req.params.id,
      vendor: req.user.userId          // ✅ fixed
    });

    if (!job)
      return res.status(404).json({ success: false, message: 'Complaint not found' });

    job.complaint.vendorReply = vendorReply;
    job.complaint.status      = 'Resolved';
    await job.save();

    res.json({ success: true, message: 'Reply sent', data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};