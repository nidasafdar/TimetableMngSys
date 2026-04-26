const { pool } = require('./config/db');
require('dotenv').config();

const check = async () => {
  try {
    const [columns] = await pool.query('DESCRIBE timeslots');
    console.log('Columns in timeslots:', JSON.stringify(columns, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

check();
