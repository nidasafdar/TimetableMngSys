const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get all timeslots
router.get('/', async (req, res) => {
  try {
    // We remove room_number from ORDER BY temporarily to prevent crashes if migration hasn't finished
    const [rows] = await pool.query('SELECT * FROM timeslots ORDER BY day, start_time');
    const timeslots = rows.map(row => ({
      id: row.id,
      day: row.day,
      startTime: row.start_time,
      endTime: row.end_time,
      roomNumber: row.room_number || 'N/A', // Handle case where column might be missing
      createdAt: row.created_at
    }));
    res.json(timeslots);
  } catch (error) {
    console.error('[TimeSlots GET Error]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Add timeslots (Bulk)
router.post('/', async (req, res) => {
  try {
    const { day, startTime, endTime, availableRooms } = req.body;

    if (!day || !startTime || !endTime || !availableRooms || availableRooms.length === 0) {
      return res.status(400).json({ error: 'All fields including at least one room are required' });
    }

    // Attempt to insert. If room_number doesn't exist, this will fail.
    // However, our initDB.js should have added it.
    const values = availableRooms.map(room => [day, startTime, endTime, room]);
    
    await pool.query(
      'INSERT INTO timeslots (day, start_time, end_time, room_number) VALUES ?',
      [values]
    );

    res.status(201).json({
      message: `${availableRooms.length} time slots created successfully`,
    });
  } catch (error) {
    console.error('[TimeSlots POST Error]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete a timeslot
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM timeslots WHERE id = ?', [req.params.id]);
    res.json({ message: 'Time slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
