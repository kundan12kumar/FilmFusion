const express = require('express');
const { setThemeCookie, getThemeFromRequest } = require('../utils/cookies');

const router = express.Router();

// Get theme preference
router.get('/theme', (req, res) => {
  try {
    const theme = getThemeFromRequest(req);
    res.json({ theme });
  } catch (error) {
    console.error('Get theme error:', error);
    res.status(500).json({ error: 'Failed to get theme preference' });
  }
});

// Set theme preference
router.post('/theme', (req, res) => {
  try {
    const { theme } = req.body;
    
    if (!theme || !['dark', 'light', 'purple'].includes(theme)) {
      return res.status(400).json({ error: 'Invalid theme. Must be dark, light, or purple' });
    }
    
    // Set theme cookie
    setThemeCookie(res, theme);
    
    res.json({
      message: 'Theme preference updated',
      theme
    });
  } catch (error) {
    console.error('Set theme error:', error);
    res.status(500).json({ error: 'Failed to set theme preference' });
  }
});

module.exports = router;
