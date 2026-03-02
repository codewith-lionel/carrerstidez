const mongoose = require('mongoose');

const savedProgramSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true,
  },
}, { timestamps: true });

savedProgramSchema.index({ user: 1, program: 1 }, { unique: true });
savedProgramSchema.index({ user: 1 });

module.exports = mongoose.model('SavedProgram', savedProgramSchema);
