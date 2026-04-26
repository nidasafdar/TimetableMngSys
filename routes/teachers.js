const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get all teachers
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM teachers ORDER BY created_at DESC');
    // Map column names to match frontend expectations
    const teachers = rows.map(row => ({
      id: row.id,
      name: row.name,
      teacherId: row.teacher_id,
      email: row.email,
      department: row.department,
      createdAt: row.created_at
    }));
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a teacher
router.post('/', async (req, res) => {
  try {
    const { name, teacherId, email, department } = req.body;
    
    if (!name || !teacherId || !email || !department) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO teachers (name, teacher_id, email, department) VALUES (?, ?, ?, ?)',
      [name, teacherId, email, department]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      teacherId,
      email,
      department,
      createdAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a teacher
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM teachers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
