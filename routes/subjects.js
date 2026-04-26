const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM subjects ORDER BY created_at DESC');
    const subjects = rows.map(row => ({
      id: row.id,
      name: row.name,
      code: row.code,
      teacher: row.teacher,
      credits: row.credits,
      createdAt: row.created_at
    }));
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a subject
router.post('/', async (req, res) => {
  try {
    const { name, code, teacher, credits } = req.body;

    if (!name || !code || !teacher || !credits) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO subjects (name, code, teacher, credits) VALUES (?, ?, ?, ?)',
      [name, code, teacher, credits]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      code,
      teacher,
      credits,
      createdAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a subject
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
