const Scholarship = require('../models/Scholarship');

exports.createScholarship = async (req, res, next) => {
  try {
    const scholarship = await Scholarship.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json({ success: true, data: scholarship });
  } catch (error) {
    next(error);
  }
};

exports.getScholarships = async (req, res, next) => {
  try {
    const { search, country, degree, type, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    if (search) query.$text = { $search: search };
    if (country) query.country = { $regex: country, $options: 'i' };
    if (degree) query['eligibility.degree'] = degree;
    if (type) query['amount.type'] = type;
    const skip = (Number(page) - 1) * Number(limit);
    const [scholarships, total] = await Promise.all([
      Scholarship.find(query).populate('university', 'name country logo').sort('-createdAt').skip(skip).limit(Number(limit)),
      Scholarship.countDocuments(query),
    ]);
    res.json({
      success: true,
      data: scholarships,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)), limit: Number(limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getScholarship = async (req, res, next) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id).populate('university');
    if (!scholarship) return res.status(404).json({ success: false, message: 'Scholarship not found' });
    res.json({ success: true, data: scholarship });
  } catch (error) {
    next(error);
  }
};

exports.updateScholarship = async (req, res, next) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!scholarship) return res.status(404).json({ success: false, message: 'Scholarship not found' });
    res.json({ success: true, data: scholarship });
  } catch (error) {
    next(error);
  }
};

exports.deleteScholarship = async (req, res, next) => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
    if (!scholarship) return res.status(404).json({ success: false, message: 'Scholarship not found' });
    res.json({ success: true, message: 'Scholarship deleted successfully' });
  } catch (error) {
    next(error);
  }
};
