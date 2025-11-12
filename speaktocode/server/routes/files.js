const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// In-memory file storage per user session
// In production, you might want to use MongoDB GridFS or cloud storage
const userFileSystems = new Map();

// Initialize file system for user - Multiple root folders support
const initializeFileSystem = () => ({
  roots: {
    'My Project': {
      type: 'folder',
      name: 'My Project',
      isRoot: true,
      children: {
        src: {
          type: 'folder',
          name: 'src',
          children: {
            'index.js': {
              type: 'file',
              name: 'index.js',
              language: 'javascript',
              content: `// Main application entry point\nconsole.log('Welcome to SpeakToCode!');\n\n// Try voice commands:\n// - "create file [name]"\n// - "save file"\n// - "open settings"\n// - "dark mode"\n// - "help" to see all commands`
            },
            components: {
              type: 'folder',
              name: 'components',
              children: {
                'Editor.jsx': {
                  type: 'file',
                  name: 'Editor.jsx',
                  language: 'javascript',
                  content: `import React from 'react';\n\nconst Editor = () => {\n  return <div>Editor Component</div>;\n};\n\nexport default Editor;`
                }
              }
            }
          }
        },
        'README.md': {
          type: 'file',
          name: 'README.md',
          language: 'markdown',
          content: `# SpeakToCode Project\n\nVoice-controlled code editor with advanced features.\n\n## Features\n- Voice Control\n- File Management\n- Import/Export\n- Keyboard Shortcuts\n- Drag & Drop`
        }
      }
    }
  }
});

// @route   GET /api/files
// @desc    Get user's file system
// @access  Private
router.get('/', protect, (req, res) => {
  try {
    const userId = req.user.id.toString();
    
    if (!userFileSystems.has(userId)) {
      userFileSystems.set(userId, initializeFileSystem());
    }
    
    res.json({
      success: true,
      fileSystem: userFileSystems.get(userId)
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error fetching files' 
    });
  }
});

// @route   POST /api/files
// @desc    Update file system
// @access  Private
router.post('/', protect, (req, res) => {
  try {
    const userId = req.user.id.toString();
    const { fileSystem } = req.body;
    
    userFileSystems.set(userId, fileSystem);
    
    res.json({
      success: true,
      message: 'File system updated',
      fileSystem
    });
  } catch (error) {
    console.error('Update files error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error updating files' 
    });
  }
});

// @route   DELETE /api/files/reset
// @desc    Reset file system to default
// @access  Private
router.delete('/reset', protect, (req, res) => {
  try {
    const userId = req.user.id.toString();
    const fileSystem = initializeFileSystem();
    
    userFileSystems.set(userId, fileSystem);
    
    res.json({
      success: true,
      message: 'File system reset to default',
      fileSystem
    });
  } catch (error) {
    console.error('Reset files error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error resetting files' 
    });
  }
});

module.exports = router;
