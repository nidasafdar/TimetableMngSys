const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get all timetable entries
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM timetables ORDER BY created_at DESC');
    const timetables = rows.map(row => ({
      id: row.id,
      subjectId: row.subject_id,
      subjectName: row.subject_name,
      subjectCode: row.subject_code,
      teacherName: row.teacher_name,
      teacherId: row.teacher_id_ref,
      roomNumber: row.room_number,
      roomId: row.room_id,
      day: row.day,
      startTime: row.start_time,
      endTime: row.end_time,
      batch: row.batch,
      createdAt: row.created_at
    }));
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save multiple timetable entries (bulk insert)
router.post('/bulk', async (req, res) => {
  try {
    const { entries } = req.body;

    if (!entries || entries.length === 0) {
      return res.status(400).json({ error: 'No entries to save' });
    }

    const values = entries.map(entry => [
      entry.subjectId,
      entry.subjectName,
      entry.subjectCode,
      entry.teacherName,
      entry.teacherId,
      entry.roomNumber,
      entry.roomId,
      entry.day,
      entry.startTime,
      entry.endTime,
      entry.batch || 'General'
    ]);

    const [result] = await pool.query(
      `INSERT INTO timetables 
        (subject_id, subject_name, subject_code, teacher_name, teacher_id_ref, room_number, room_id, day, start_time, end_time, batch) 
       VALUES ?`,
      [values]
    );

    res.status(201).json({
      message: 'Timetable saved successfully',
      insertedCount: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete all timetable entries
router.delete('/all', async (req, res) => {
  try {
    await pool.query('DELETE FROM timetables');
    res.json({ message: 'All timetable entries deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a single timetable entry (For resolving conflicts)
router.put('/:id', async (req, res) => {
  try {
    const { day, startTime, endTime, roomId, roomNumber } = req.body;
    const { id } = req.params;

    await pool.query(
      'UPDATE timetables SET day = ?, start_time = ?, end_time = ?, room_id = ?, room_number = ? WHERE id = ?',
      [day, startTime, endTime, roomId, roomNumber, id]
    );

    res.json({ message: 'Timetable entry updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
