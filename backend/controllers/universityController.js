const University = require('../models/University');

exports.createUniversity = async (req, res, next) => {
  try {
    const university = await University.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json({ success: true, data: university });
  } catch (error) {
    next(error);
  }
};

exports.getUniversities = async (req, res, next) => {
  try {
    const { search, country, type, rankingMin, rankingMax, feeMin, feeMax, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    if (search) query.$text = { $search: search };
    if (country) query.country = { $regex: country, $options: 'i' };
    if (type) query.type = type;
    if (rankingMin) query['ranking.world'] = { $gte: Number(rankingMin) };
    if (rankingMax) query['ranking.world'] = { ...query['ranking.world'], $lte: Number(rankingMax) };
    if (feeMin) query['tuitionFee.undergraduate'] = { $gte: Number(feeMin) };
    if (feeMax) query['tuitionFee.undergraduate'] = { ...query['tuitionFee.undergraduate'], $lte: Number(feeMax) };
    const skip = (Number(page) - 1) * Number(limit);
    const [universities, total] = await Promise.all([
      University.find(query).sort('ranking.world').skip(skip).limit(Number(limit)),
      University.countDocuments(query),
    ]);
    res.json({
      success: true,
      data: universities,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)), limit: Number(limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUniversity = async (req, res, next) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) return res.status(404).json({ success: false, message: 'University not found' });
    res.json({ success: true, data: university });
  } catch (error) {
    next(error);
  }
};

exports.updateUniversity = async (req, res, next) => {
  try {
    const university = await University.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!university) return res.status(404).json({ success: false, message: 'University not found' });
    res.json({ success: true, data: university });
  } catch (error) {
    next(error);
  }
};

exports.deleteUniversity = async (req, res, next) => {
  try {
    const university = await University.findByIdAndDelete(req.params.id);
    if (!university) return res.status(404).json({ success: false, message: 'University not found' });
    res.json({ success: true, message: 'University deleted successfully' });
  } catch (error) {
    next(error);
  }
};
