const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/db');
const initDatabase = require('./initDB');

// Import routes
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teachers');
const subjectRoutes = require('./routes/subjects');
const classroomRoutes = require('./routes/classrooms');
const timeslotRoutes = require('./routes/timeslots');
const timetableRoutes = require('./routes/timetables');
const conflictRoutes = require('./routes/conflicts');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/timeslots', timeslotRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/conflicts', conflictRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Timetable API is running' });
});

// Start server
const startServer = async () => {
  try {
    await testConnection();
    await initDatabase();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API endpoints:`);
      console.log(`   POST   /api/auth/register`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   GET    /api/teachers`);
      console.log(`   POST   /api/teachers`);
      console.log(`   DELETE /api/teachers/:id`);
      console.log(`   GET    /api/subjects`);
      console.log(`   POST   /api/subjects`);
      console.log(`   DELETE /api/subjects/:id`);
      console.log(`   GET    /api/classrooms`);
      console.log(`   POST   /api/classrooms`);
      console.log(`   DELETE /api/classrooms/:id`);
      console.log(`   GET    /api/timeslots`);
      console.log(`   POST   /api/timeslots`);
      console.log(`   DELETE /api/timeslots/:id`);
      console.log(`   GET    /api/timetables`);
      console.log(`   POST   /api/timetables/bulk`);
      console.log(`   DELETE /api/timetables/all`);
      console.log(`   GET    /api/conflicts`);
      console.log(`   POST   /api/conflicts/bulk`);
      console.log(`   DELETE /api/conflicts/all`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
