const express = require('express');
const { query } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user info with stats (using content_id instead of movie_id)
    const userResult = await query(
      `SELECT u.id, u.email, u.name, u.avatar_url, u.created_at,
       COUNT(DISTINCT r.content_id) as total_ratings,
       COUNT(DISTINCT w.content_id) as watchlist_count,
       ROUND(AVG(r.rating), 2) as average_rating
       FROM users u
       LEFT JOIN ratings r ON u.id = r.user_id
       LEFT JOIN watchlist w ON u.id = w.user_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userResult.rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Rate content (movie or TV show)
router.post('/rate', authenticateToken, async (req, res) => {
  try {
    const { contentId, movieId, contentType = 'movie', category = 'hollywood', rating, review } = req.body;
    const userId = req.user.id;

    // Support both old movieId and new contentId for backward compatibility
    let actualContentId = contentId || movieId;

    // Extract numeric ID if slug is present (e.g., "20453-3-idiots" -> "20453")
    if (typeof actualContentId === 'string') {
      actualContentId = actualContentId.split('-')[0];
    }

    // Convert to integer
    actualContentId = parseInt(actualContentId);

    if (!actualContentId || !rating) {
      return res.status(400).json({ error: 'Content ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (!['movie', 'tv'].includes(contentType)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    // First, try to update existing rating
    const updateResult = await query(
      `UPDATE ratings SET rating = $1, review = $2, category = $3, timestamp = CURRENT_TIMESTAMP
       WHERE user_id = $4 AND content_id = $5 AND content_type = $6`,
      [rating, review, category, userId, actualContentId, contentType]
    );

    // If no rows were updated, insert a new rating
    if (updateResult.rowCount === 0) {
      await query(
        `INSERT INTO ratings (user_id, content_id, content_type, category, rating, review)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, actualContentId, contentType, category, rating, review]
      );
    }

    res.json({ message: 'Rating saved successfully' });
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ error: 'Failed to save rating' });
  }
});

// Get user's ratings
router.get('/ratings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT r.content_id as movie_id, r.rating, r.review, r.timestamp, cc.title, cc.poster_path
       FROM ratings r
       LEFT JOIN content_cache cc ON r.content_id = cc.content_id AND r.content_type = cc.content_type
       WHERE r.user_id = $1
       ORDER BY r.timestamp DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) FROM ratings WHERE user_id = $1',
      [userId]
    );

    res.json({
      ratings: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Add to watchlist
router.post('/watchlist', authenticateToken, async (req, res) => {
  try {
    const { contentId, movieId, contentType = 'movie', category = 'hollywood' } = req.body;
    const userId = req.user.id;

    // Support both old movieId and new contentId for backward compatibility
    let actualContentId = contentId || movieId;

    // Extract numeric ID if slug is present
    if (typeof actualContentId === 'string') {
      actualContentId = actualContentId.split('-')[0];
    }

    // Convert to integer
    actualContentId = parseInt(actualContentId);

    if (!actualContentId) {
      return res.status(400).json({ error: 'Content ID is required' });
    }

    if (!['movie', 'tv'].includes(contentType)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    // Check if already in watchlist
    const existingResult = await query(
      'SELECT 1 FROM watchlist WHERE user_id = $1 AND content_id = $2 AND content_type = $3',
      [userId, actualContentId, contentType]
    );

    // Only insert if not already in watchlist
    if (existingResult.rows.length === 0) {
      await query(
        'INSERT INTO watchlist (user_id, content_id, content_type, category) VALUES ($1, $2, $3, $4)',
        [userId, actualContentId, contentType, category]
      );
    }

    res.json({ message: 'Content added to watchlist' });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

// Remove from watchlist
router.delete('/watchlist/:contentId/:contentType?', authenticateToken, async (req, res) => {
  try {
    let { contentId, contentType = 'movie' } = req.params;
    const userId = req.user.id;

    // Extract numeric ID if slug is present
    if (typeof contentId === 'string') {
      contentId = contentId.split('-')[0];
    }

    // Convert to integer
    contentId = parseInt(contentId);

    await query(
      'DELETE FROM watchlist WHERE user_id = $1 AND content_id = $2 AND content_type = $3',
      [userId, contentId, contentType]
    );

    res.json({ message: 'Content removed from watchlist' });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

// Legacy route for backward compatibility
router.delete('/watchlist/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    await query(
      'DELETE FROM watchlist WHERE user_id = $1 AND content_id = $2 AND content_type = $3',
      [userId, movieId, 'movie']
    );

    res.json({ message: 'Movie removed from watchlist' });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

// Get user's watchlist
router.get('/watchlist', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT w.content_id as movie_id, w.added_at, cc.title, cc.poster_path, cc.overview, cc.vote_average
       FROM watchlist w
       LEFT JOIN content_cache cc ON w.content_id = cc.content_id AND w.content_type = cc.content_type
       WHERE w.user_id = $1
       ORDER BY w.added_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) FROM watchlist WHERE user_id = $1',
      [userId]
    );

    // Transform the data to match frontend expectations
    const movies = result.rows.map(row => ({
      id: row.movie_id,
      title: row.title,
      poster_path: row.poster_path,
      overview: row.overview,
      vote_average: row.vote_average,
      added_at: row.added_at
    }));

    const total = parseInt(countResult.rows[0].count);

    res.json({
      movies,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      hasMore: (page * limit) < total
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Check if content is in watchlist (new unified endpoint)
router.get('/watchlist/check/:contentId', authenticateToken, async (req, res) => {
  try {
    let { contentId } = req.params;
    const { contentType = 'movie' } = req.query;
    const userId = req.user.id;

    // Extract numeric ID if slug is present
    if (typeof contentId === 'string') {
      contentId = contentId.split('-')[0];
    }

    // Convert to integer
    contentId = parseInt(contentId);

    const result = await query(
      'SELECT 1 FROM watchlist WHERE user_id = $1 AND content_id = $2 AND content_type = $3',
      [userId, contentId, contentType]
    );

    res.json({ inWatchlist: result.rows.length > 0 });
  } catch (error) {
    console.error('Error checking watchlist:', error);
    res.status(500).json({ error: 'Failed to check watchlist' });
  }
});

// Legacy endpoint for backward compatibility
router.get('/watchlist/check/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    const result = await query(
      'SELECT 1 FROM watchlist WHERE user_id = $1 AND content_id = $2 AND content_type = $3',
      [userId, movieId, 'movie']
    );

    res.json({ inWatchlist: result.rows.length > 0 });
  } catch (error) {
    console.error('Error checking watchlist:', error);
    res.status(500).json({ error: 'Failed to check watchlist' });
  }
});

// Get user's rating for content (new unified endpoint)
router.get('/rating/:contentId', authenticateToken, async (req, res) => {
  try {
    let { contentId } = req.params;
    const { contentType = 'movie' } = req.query;
    const userId = req.user.id;

    // Extract numeric ID if slug is present
    if (typeof contentId === 'string') {
      contentId = contentId.split('-')[0];
    }

    // Convert to integer
    contentId = parseInt(contentId);

    const result = await query(
      'SELECT rating, review, timestamp FROM ratings WHERE user_id = $1 AND content_id = $2 AND content_type = $3',
      [userId, contentId, contentType]
    );

    if (result.rows.length === 0) {
      return res.json({ rating: null });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user rating:', error);
    res.status(500).json({ error: 'Failed to fetch rating' });
  }
});

module.exports = router;
