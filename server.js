const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'polyglotpal'
});

// LOGIN
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
      const user = results[0];
      res.json({ id: user.id, name: user.name, email: user.email });
    }
  );
});

// SYNC USER
app.post('/api/sync-user', (req, res) => {
  const { email } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = results[0];
    res.json({ id: user.id, name: user.name, email: user.email });
  });
});

// FILL-IN-THE-BLANK
app.get('/api/fill-blank/:level', (req, res) => {
  const level = parseInt(req.params.level);
  const lang = req.query.lang || 'trtoeng';
  db.query(
    'SELECT * FROM fill_in_blank_questions WHERE level = ? AND lang = ? ORDER BY question_number',
    [level, lang],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// VOCABULARY
app.get('/api/vocabulary/:level', (req, res) => {
  const level = parseInt(req.params.level);
  const lang = req.query.lang || 'trtoeng';

  db.query(
    'SELECT * FROM vocabulary_questions WHERE level = ? AND lang = ?',
    [level, lang],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// SENTENCES
app.get('/api/sentences/:level', (req, res) => {
  const level = parseInt(req.params.level);
  const lang = req.query.lang || 'trtoeng';

  db.query(
    'SELECT * FROM sentences_questions WHERE level = ? AND lang = ? ORDER BY id',
    [level, lang],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// IMAGE QUESTIONS
app.get('/api/image_questions/:level', (req, res) => {
  const level = parseInt(req.params.level);
  const lang = req.query.lang || 'trtoeng';

  db.query(
    'SELECT * FROM image_questions WHERE level = ? AND lang = ?',
    [level, lang],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results);
    }
  );
});

// GRAMMAR QUESTIONS
app.get('/api/grammar_questions/:level', (req, res) => {
  const level = parseInt(req.params.level);
  const lang = req.query.lang || 'trtoeng';

  if (isNaN(level)) return res.status(400).json({ error: 'Invalid level' });

  db.query(
    'SELECT * FROM grammar_questions WHERE level = ? AND lang = ?',
    [level, lang],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results);
    }
  );
});

// SAVE PROGRESS
app.post('/api/progress', (req, res) => {
  const { user_id, activity_type, level, score, completed, lang } = req.body;

  const query = `
    INSERT INTO progress (user_id, activity_type, level, score, completed, lang)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      score = VALUES(score),
      completed = VALUES(completed),
      updated_at = CURRENT_TIMESTAMP,
      lang = VALUES(lang)
  `;

  db.query(query, [user_id, activity_type, level, score, completed, lang], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: '✅ Progress updated successfully' });
  });
});

// GET PROGRESS FOR USER + ACTIVITY
app.get('/api/progress/:user_id/:activity_type', (req, res) => {
  const { user_id, activity_type } = req.params;
  const lang = req.query.lang;

  if (!lang) return res.status(400).json({ error: 'Missing language parameter' });

  const query = `
    SELECT user_id, activity_type, level, score, completed
    FROM progress
    WHERE user_id = ? AND activity_type = ? AND lang = ?
    ORDER BY level
  `;

  db.query(query, [user_id, activity_type, lang], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});


// USER STATS
app.get('/api/user-stats/:user_id', (req, res) => {
  const userId = req.params.user_id;

  db.query(`
    SELECT 
      (SELECT COUNT(*) FROM progress WHERE user_id = ? AND completed = 1) AS lessonsCompleted,
      (SELECT IFNULL(SUM(score), 0) FROM progress WHERE user_id = ? AND activity_type = 'vocabulary') AS wordsLearned,
      (SELECT IFNULL(SUM(score), 0) * 10 FROM progress WHERE user_id = ?) AS totalXP,
      (SELECT COUNT(*) FROM progress WHERE user_id = ? AND level = 1 AND completed = 1) AS firstLesson,
      (SELECT IFNULL(SUM(score), 0) FROM progress WHERE user_id = ? AND activity_type = 'vocabulary') >= 100 AS wordMaster,
      (SELECT MAX(DATEDIFF(NOW(), updated_at)) <= 1 FROM progress WHERE user_id = ?) AS dayStreak
  `, [userId, userId, userId, userId, userId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

app.listen(3001, () => {
  console.log('✅ Backend running at http://localhost:3001');
});
