const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/settings
// @desc    Get user settings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('settings');
    res.json({
      success: true,
      settings: user.settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error fetching settings' 
    });
  }
});

// @route   PUT /api/settings
// @desc    Update user settings
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Update settings
    user.settings = { ...user.settings, ...req.body };
    await user.save();

    res.json({
      success: true,
      message: 'Settings saved successfully',
      settings: user.settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error updating settings' 
    });
  }
});

// @route   POST /api/settings/reset
// @desc    Reset settings to default
// @access  Private
router.post('/reset', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Reset to default settings
    user.settings = {
      theme: 'dark',
      fontSize: 14,
      fontFamily: 'Consolas',
      tabSize: 2,
      lineHeight: 1.5,
      cursorStyle: 'line',
      wordWrap: true,
      lineNumbers: true,
      minimapEnabled: true,
      autoSave: false,
      autoSaveInterval: 5000,
      formatOnSave: false,
      autoCloseBrackets: true,
      voiceLanguage: 'en-US',
      voiceSensitivity: 0.7,
      continuousListening: true,
      voiceFeedback: true,
      sortBy: 'name',
      showHiddenFiles: false,
      compactFolders: false,
      confirmBeforeDelete: true,
      autoReveal: true,
      smoothScroll: true
    };
    
    await user.save();

    res.json({
      success: true,
      message: 'Settings reset to defaults',
      settings: user.settings
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error resetting settings' 
    });
  }
});

module.exports = router;
