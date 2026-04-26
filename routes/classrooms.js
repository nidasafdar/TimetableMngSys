const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get all classrooms
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM classrooms ORDER BY created_at DESC');
    const classrooms = rows.map(row => ({
      id: row.id,
      roomNumber: row.room_number,
      capacity: row.capacity,
      type: row.type,
      createdAt: row.created_at
    }));
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a classroom
router.post('/', async (req, res) => {
  try {
    const { roomNumber, capacity, type } = req.body;

    if (!roomNumber || !capacity || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO classrooms (room_number, capacity, type) VALUES (?, ?, ?)',
      [roomNumber, capacity, type]
    );

    res.status(201).json({
      id: result.insertId,
      roomNumber,
      capacity,
      type,
      createdAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a classroom
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM classrooms WHERE id = ?', [req.params.id]);
    res.json({ message: 'Classroom deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
