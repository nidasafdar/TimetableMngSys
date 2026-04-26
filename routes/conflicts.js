const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get all conflicts
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM timetable_conflicts ORDER BY created_at DESC');
    const conflicts = rows.map(row => ({
      id: row.id,
      conflictType: row.conflict_type,
      details: row.details,
      day: row.day,
      time: row.time,
      conflictingSubjects: JSON.parse(row.conflicting_subjects || '[]'),
      createdAt: row.created_at
    }));
    res.json(conflicts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save conflicts (bulk insert)
router.post('/bulk', async (req, res) => {
  try {
    const { conflicts } = req.body;

    if (!conflicts || conflicts.length === 0) {
      return res.status(400).json({ error: 'No conflicts to save' });
    }

    const values = conflicts.map(c => [
      c.conflictType,
      c.details,
      c.day,
      c.time,
      JSON.stringify(c.conflictingSubjects)
    ]);

    const [result] = await pool.query(
      `INSERT INTO timetable_conflicts 
        (conflict_type, details, day, time, conflicting_subjects) 
       VALUES ?`,
      [values]
    );

    res.status(201).json({
      message: 'Conflicts saved successfully',
      insertedCount: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete all conflicts
router.delete('/all', async (req, res) => {
  try {
    await pool.query('DELETE FROM timetable_conflicts');
    res.json({ message: 'All conflicts deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
