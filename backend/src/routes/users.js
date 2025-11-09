const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

module.exports = (db, authMiddleware, requireRole) => {
  router.get('/me', authMiddleware, async (req, res) => {
    const user = await db.get(`SELECT id,name,email,role,school,rank,pm,pc,house FROM users WHERE id = ?`, [req.user.id]);
    res.json({ user });
  });

  router.get('/', authMiddleware, requireRole('teacher'), async (req, res) => {
    const rows = await db.all(`SELECT id,name,email,role,school,rank,pm,pc,house FROM users`);
    res.json({ users: rows });
  });

  router.patch('/:id', authMiddleware, requireRole('teacher'), async (req, res) => {
    const { id } = req.params;
    const fields = ['name', 'school', 'rank', 'pm', 'pc', 'house'];
    const updates = [];
    const values = [];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        updates.push(`${f} = ?`);
        values.push(req.body[f]);
      }
    }
    if (!updates.length) return res.status(400).json({ error: 'No fields' });
    values.push(id);
    await db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    const user = await db.get(`SELECT id,name,role,school,rank,pm,pc,house FROM users WHERE id = ?`, [id]);
    res.json({ user });
  });

  return router;
};
