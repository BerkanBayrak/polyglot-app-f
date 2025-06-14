const express = require('express');
const mysql = require('mysql2/promise'); // use promise-based pool for better async/await
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const progressRoutes = require('./routes/progress');
app.use('/api/progress', progressRoutes);

const userRoutes = require('./routes/users');
app.use('/api', userRoutes);


// MySQL connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'polyglotpal'
});

// Make db accessible to routers
app.set('db', db);

// Fill-in-the-blank route (you already had)
app.get('/api/fill-blank/:level', (req, res) => {
  const level = parseInt(req.params.level);
  db.query(
    'SELECT * FROM fill_in_blank_questions WHERE level = ? ORDER BY question_number',
    [level],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});
