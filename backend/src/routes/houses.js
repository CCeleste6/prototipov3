const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

module.exports = (db, authMiddleware, requireRole) => {
  router.post('/', authMiddleware, requireRole('teacher'), async (req, res) => {
    const { name, description } = req.body;
    const id = uuidv4();
    await db.run(`INSERT INTO houses(id,name,description,pc) VALUES(?,?,?,0)`, [id, name, description]);
    const house = await db.get(`SELECT * FROM houses WHERE id = ?`, [id]);
    res.json({ house });
  });

  router.get('/', authMiddleware, async (req, res) => {
    const houses = await db.all(`SELECT * FROM houses`);
    res.json({ houses });
  });

  return router;
};
