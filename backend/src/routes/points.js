const express = require('express');
const router = express.Router();

module.exports = (db, authMiddleware, requireRole) => {
  router.get('/leaderboard', authMiddleware, async (req, res) => {
    const top = await db.all(`SELECT id,name,pm,pc,rank,house FROM users ORDER BY pm DESC LIMIT 50`);
    res.json({ top });
  });

  router.get('/houses', authMiddleware, async (req, res) => {
    const houses = await db.all(`SELECT id,name,description,pc FROM houses ORDER BY pc DESC`);
    res.json({ houses });
  });

  return router;
};
