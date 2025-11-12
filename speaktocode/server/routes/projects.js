const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @route   POST /api/projects/export
// @desc    Export project as JSON
// @access  Private
router.post('/export', protect, (req, res) => {
  try {
    const { fileSystem, projectName } = req.body;
    
    res.json({
      success: true,
      message: 'Project exported successfully',
      data: {
        projectName: projectName || 'My Project',
        fileSystem,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    });
  } catch (error) {
    console.error('Export project error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error exporting project' 
    });
  }
});

// @route   POST /api/projects/import
// @desc    Import project from JSON
// @access  Private
router.post('/import', protect, (req, res) => {
  try {
    const { fileSystem, projectName } = req.body;
    
    res.json({
      success: true,
      message: 'Project imported successfully',
      fileSystem,
      projectName
    });
  } catch (error) {
    console.error('Import project error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error importing project' 
    });
  }
});

module.exports = router;
