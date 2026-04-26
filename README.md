# Automatic Timetable Generator 📅

A full-stack web application designed to automate the creation of educational timetables, featuring a React frontend, Express backend, and MySQL database.

## 🚀 Features
- **Teacher Management**: Add, view, and delete teachers.
- **Subject Management**: Manage subjects with credit hours and assigned teachers.
- **Classroom Management**: Define rooms with specific capacities and types.
- **Time Slot Management**: Create time slots with bulk room assignment (one row per room).
- **Automated Generation**: A conflict-detection algorithm that generates a complete schedule.
- **Conflict Audit**: Real-time detection of teacher overlaps, room double-bookings, and resource scarcity.

## 🛠️ Technology Stack
- **Frontend**: React (Vite), Lucide-React (Icons), Vanilla CSS.
- **Backend**: Node.js, Express.
- **Database**: MySQL.

---

## ⚙️ Database Setup (Required)

1. **Install MySQL**: Ensure you have MySQL Server installed on your machine.
2. **Create Database**:
   ```sql
   CREATE DATABASE timetable_db;
   ```
3. **Configure Environment**: Create a `.env` file in the `backend` directory:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=timetable_db
   PORT=5000
   JWT_SECRET=your_secret_key
   ```

---

## 🏃‍♂️ How to Run

### 1. Start the Backend
```bash
cd backend
npm install
npm start
```
*The backend will automatically create all required tables and handle migrations on startup.*

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## 📝 Usage Tips
1. **Initial Setup**: First add your **Classrooms** and **Teachers**.
2. **Time Slots**: When adding time slots, you can select multiple classrooms to create individual rows for each.
3. **Generation**: Go to the "Generate" screen. If you have enough slots and rooms for your subjects, the system will create a conflict-free schedule.
4. **Conflicts**: Use the "Check Conflicts" screen to identify where you need more rooms or time slots.

## 👥 Admin Access
- **Default Email**: `admin@test.com`
- **Default Password**: `password123`

---
*Created for efficient educational management.*
