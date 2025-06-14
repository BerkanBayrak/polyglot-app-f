// POST /api/sync-user
router.post('/sync-user', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  const queryCheck = 'SELECT * FROM users WHERE email = ?';
  const queryInsert = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

  db.query(queryCheck, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.json(results[0]); // ✅ Return existing user
    }

    const name = email.split('@')[0];
    const dummyPassword = 'mock'; // not used

    db.query(queryInsert, [name, email, dummyPassword], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });

      res.json({ id: result.insertId, name, email });
    });
  });
});
