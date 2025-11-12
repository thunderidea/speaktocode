const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        const allowedDomains = [
          '@gmail.com',
          '@yahoo.com',
          '@outlook.com',
          '@hotmail.com',
          '@icloud.com',
          '@protonmail.com'
        ];
        return allowedDomains.some(domain => email.endsWith(domain));
      },
      message: 'Email must be from gmail.com, yahoo.com, outlook.com, hotmail.com, icloud.com, or protonmail.com'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  settings: {
    theme: { type: String, default: 'dark' },
    fontSize: { type: Number, default: 14 },
    fontFamily: { type: String, default: 'Consolas' },
    tabSize: { type: Number, default: 2 },
    lineHeight: { type: Number, default: 1.5 },
    cursorStyle: { type: String, default: 'line' },
    wordWrap: { type: Boolean, default: true },
    lineNumbers: { type: Boolean, default: true },
    minimapEnabled: { type: Boolean, default: true },
    autoSave: { type: Boolean, default: false },
    autoSaveInterval: { type: Number, default: 5000 },
    formatOnSave: { type: Boolean, default: false },
    autoCloseBrackets: { type: Boolean, default: true },
    voiceLanguage: { type: String, default: 'en-US' },
    voiceSensitivity: { type: Number, default: 0.7 },
    continuousListening: { type: Boolean, default: true },
    voiceFeedback: { type: Boolean, default: true },
    sortBy: { type: String, default: 'name' },
    showHiddenFiles: { type: Boolean, default: false },
    compactFolders: { type: Boolean, default: false },
    confirmBeforeDelete: { type: Boolean, default: true },
    autoReveal: { type: Boolean, default: true },
    smoothScroll: { type: Boolean, default: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
