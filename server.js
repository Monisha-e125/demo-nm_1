const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

/* -------------------- DATABASE CONNECTION -------------------- */
connectDB();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* -------------------- STATIC FILES -------------------- */
app.use(express.static('public'));

/* -------------------- ROUTES -------------------- */

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Statutory routes
app.use('/api/statutory', require('./routes/statutoryRoutes'));
const organizationRoutes = require('./routes/organizationRoutes');
app.use('/api/organization', organizationRoutes);
// Module 3: Employee Payroll Profile
const payrollProfileRoutes = require('./routes/payrollProfileRoutes');
app.use('/api/payroll-profile', payrollProfileRoutes);

// Module 4: Salary Structure & Calculation
const salaryRoutes = require('./routes/salaryRoutes');

app.use('/api/salary', salaryRoutes);
// Module 5: Attendance & Leave Integration
const attendanceRoutes = require('./routes/attendanceRoutes');
app.use('/api/attendance', attendanceRoutes);
const employeeRoutes = require("./routes/employeeRoutes");
app.use("/api/employee", employeeRoutes);
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);


/* -------------------- ROOT ROUTE -------------------- */
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

/* -------------------- 404 HANDLER -------------------- */
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.status(404).send('Page not found');
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
