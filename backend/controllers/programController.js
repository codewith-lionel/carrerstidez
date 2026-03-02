const Program = require('../models/Program');

exports.createProgram = async (req, res, next) => {
  try {
    const program = await Program.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
};

exports.getPrograms = async (req, res, next) => {
  try {
    const { search, degree, field, university, language, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    if (search) query.$text = { $search: search };
    if (degree) query.degree = degree;
    if (field) query.field = { $regex: field, $options: 'i' };
    if (university) query.university = university;
    if (language) query.language = { $regex: language, $options: 'i' };
    const skip = (Number(page) - 1) * Number(limit);
    const [programs, total] = await Promise.all([
      Program.find(query).populate('university', 'name country logo ranking').sort('-createdAt').skip(skip).limit(Number(limit)),
      Program.countDocuments(query),
    ]);
    res.json({
      success: true,
      data: programs,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)), limit: Number(limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id).populate('university');
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
};

exports.updateProgram = async (req, res, next) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
};

exports.deleteProgram = async (req, res, next) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (error) {
    next(error);
  }
};
