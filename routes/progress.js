const express = require('express');
const router = express.Router();

// GET /api/progress/:user_id/fill_in_blank
router.get('/:user_id/fill_in_blank', async (req, res) => {
  const db = req.app.get('db'); // get the pool from app
  const { user_id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT level, score, completed FROM progress WHERE user_id = ? AND activity_type = ? ORDER BY level',
      [user_id, 'fill_in_blank']
    );
    res.json(rows);
  } catch (err) {
    console.error('Progress fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

module.exports = router;
