const express = require('express');
const cors = require('cors');
const { init } = require('./db');
const authModule = require('./auth');
require('dotenv').config();

const start = async () => {
  const db = await init();
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => res.json({ ok: true, name: 'Legado Escolar API' }));

  app.use('/auth', require('./routes/auth')(db));
  app.use('/users', require('./routes/users')(db, authModule.middleware, authModule.requireRole));
  app.use('/activities', require('./routes/activities')(db, authModule.middleware, authModule.requireRole));
  app.use('/points', require('./routes/points')(db, authModule.middleware, authModule.requireRole));
  app.use('/houses', require('./routes/houses')(db, authModule.middleware, authModule.requireRole));
  app.use('/ranks', require('./routes/ranks')(db, authModule.middleware, authModule.requireRole));

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
};

start();
