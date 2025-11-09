const express = require('express');
const router = express.Router();

module.exports = (db, authMiddleware, requireRole) => {
  router.get('/', authMiddleware, async (req, res) => {
    const ranks = await db.all(`SELECT * FROM ranks ORDER BY min_points`);
    res.json({ ranks });
  });

  router.post('/recalculate', authMiddleware, requireRole('teacher'), async (req, res) => {
    const ranks = await db.all(`SELECT * FROM ranks ORDER BY min_points DESC`);
    const users = await db.all(`SELECT id,pm FROM users`);
    for (const u of users) {
      let newRank = null;
      for (const r of ranks) {
        if (u.pm >= r.min_points && u.pm <= r.max_points) {
          newRank = r.name;
          break;
        }
        if (u.pm >= r.min_points && r.max_points === null) {
          newRank = r.name;
          break;
        }
      }
      if (newRank) {
        await db.run(`UPDATE users SET rank = ? WHERE id = ?`, [newRank, u.id]);
      }
    }
    res.json({ ok: true });
  });

  return router;
};
