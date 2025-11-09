const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
require('dotenv').config();

const DB_FILE = process.env.DATABASE_FILE || path.join(__dirname, '../legado.db');

async function init() {
  const db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database
  });

  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT, -- 'student' | 'teacher' | 'admin'
    school TEXT,
    rank INTEGER DEFAULT 0,
    pm INTEGER DEFAULT 0,
    pc INTEGER DEFAULT 0,
    house TEXT
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    format TEXT, -- text|video|art|prototype|presentation
    base_pm INTEGER DEFAULT 10,
    created_at TEXT
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    activity_id TEXT,
    format TEXT,
    content TEXT,
    pm_awarded INTEGER,
    pc_awarded INTEGER,
    created_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(activity_id) REFERENCES activities(id)
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS houses (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    pc INTEGER DEFAULT 0
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS ranks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    min_points INTEGER,
    max_points INTEGER
  )`);

  return db;
}

module.exports = { init };
