const { pool } = require('./config/db');
require('dotenv').config();

const migrate = async () => {
  try {
    console.log('Starting migration...');
    // Drop the JSON column if it exists and add the room_number column
    await pool.query('ALTER TABLE timeslots DROP COLUMN IF EXISTS available_rooms');
    await pool.query('ALTER TABLE timeslots ADD COLUMN IF NOT EXISTS room_number VARCHAR(100)');
    console.log('✅ Migration successful: room_number column added.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
};

migrate();
