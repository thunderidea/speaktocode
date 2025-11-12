const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['file', 'folder'], required: true },
  content: { type: String, default: '' },
  language: { type: String, default: 'plaintext' },
  children: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    default: 'My Project'
  },
  fileSystem: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update lastModified on save
projectSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
