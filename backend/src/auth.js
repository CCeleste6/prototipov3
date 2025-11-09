const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function generateToken(user) {
  const payload = { id: user.id, role: user.role, name: user.name };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

function middleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

module.exports = { generateToken, middleware, requireRole };
