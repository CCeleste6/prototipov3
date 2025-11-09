const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

module.exports = (db, authMiddleware, requireRole) => {
  router.post('/', authMiddleware, requireRole('teacher'), async (req, res) => {
    const { title, description, format = 'text', base_pm = 10 } = req.body;
    const id = uuidv4();
    const created_at = new Date().toISOString();
    await db.run(`INSERT INTO activities(id,title,description,format,base_pm,created_at) VALUES(?,?,?,?,?,?)`,
      [id, title, description, format, base_pm, created_at]);
    const activity = await db.get(`SELECT * FROM activities WHERE id = ?`, [id]);
    res.json({ activity });
  });

  router.get('/', authMiddleware, async (req, res) => {
    const activities = await db.all(`SELECT * FROM activities ORDER BY created_at DESC`);
    res.json({ activities });
  });

  router.post('/:id/submit', authMiddleware, async (req, res) => {
    const activityId = req.params.id;
    const { format = 'text', content = '' } = req.body;
    const activity = await db.get(`SELECT * FROM activities WHERE id = ?`, [activityId]);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });

    const bonus = format === activity.format ? 2 : 0;
    const pmAwarded = activity.base_pm + bonus;
    const pcAwarded = Math.floor(pmAwarded * 0.1);

    const id = require('uuid').v4();
    const created_at = new Date().toISOString();
    await db.run(`INSERT INTO submissions(id,user_id,activity_id,format,content,pm_awarded,pc_awarded,created_at) VALUES(?,?,?,?,?,?,?,?)`,
      [id, req.user.id, activityId, format, content, pmAwarded, pcAwarded, created_at]);

    await db.run(`UPDATE users SET pm = pm + ?, pc = pc + ? WHERE id = ?`, [pmAwarded, pcAwarded, req.user.id]);

    const user = await db.get(`SELECT house FROM users WHERE id = ?`, [req.user.id]);
    if (user && user.house) {
      await db.run(`UPDATE houses SET pc = pc + ? WHERE name = ?`, [pcAwarded, user.house]);
    }

    res.json({ submission: { id, pmAwarded, pcAwarded } });
  });

  return router;
};
