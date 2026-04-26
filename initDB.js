const { pool } = require('./config/db');

const initDatabase = async () => {
  try {
    // Create database if not exists
    const tempPool = require('mysql2/promise').createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
    });

    await tempPool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'timetable_db'}`);
    await tempPool.end();

    console.log('✅ Database created/verified');

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        teacher_id VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(100) NOT NULL,
        teacher VARCHAR(255) NOT NULL,
        credits VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS classrooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_number VARCHAR(100) NOT NULL,
        capacity VARCHAR(50) NOT NULL,
        type VARCHAR(50) DEFAULT 'Lecture',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS timeslots (
        id INT AUTO_INCREMENT PRIMARY KEY,
        day VARCHAR(50) NOT NULL,
        start_time VARCHAR(50) NOT NULL,
        end_time VARCHAR(50) NOT NULL,
        room_number VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS timetables (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subject_id INT,
        subject_name VARCHAR(255),
        subject_code VARCHAR(100),
        teacher_name VARCHAR(255),
        teacher_id_ref INT,
        room_number VARCHAR(100),
        room_id INT,
        day VARCHAR(50),
        start_time VARCHAR(50),
        end_time VARCHAR(50),
        batch VARCHAR(100) DEFAULT 'General',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS timetable_conflicts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conflict_type VARCHAR(100),
        details TEXT,
        day VARCHAR(50),
        time VARCHAR(100),
        conflicting_subjects TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure room_number column exists in timeslots (migration for older databases)
    const [cols] = await pool.query('SHOW COLUMNS FROM timeslots LIKE "room_number"');
    if (cols.length === 0) {
      await pool.query('ALTER TABLE timeslots ADD COLUMN room_number VARCHAR(100)');
      console.log('✅ Added room_number column to timeslots');
    }

    console.log('✅ All tables created/verified successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

module.exports = initDatabase;
