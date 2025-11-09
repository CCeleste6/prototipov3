const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { generateToken } = require('../auth');

module.exports = (db) => {
  router.post('/register', async (req, res) => {
    const { name, email, password, role = 'student', school = null, house = null } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const hashed = await bcrypt.hash(password, 10);
    const id = uuidv4();
    try {
      await db.run(
        `INSERT INTO users(id,name,email,password,role,school,house) VALUES(?,?,?,?,?,?,?)`,
        [id, name, email, hashed, role, school, house]
      );
      const user = { id, name, email, role, school, house, pm: 0, pc: 0 };
      const token = generateToken(user);
      res.json({ user, token });
    } catch (err) {
      res.status(400).json({ error: 'Email already exists' });
    }
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = generateToken(user);
    delete user.password;
    res.json({ user, token });
  });

  return router;
};
