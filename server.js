const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

/* -------------------- MIDDLEWARES -------------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/auth', authRoutes);


/* -------------------- DATABASE CONNECTION -------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
  });

/* -------------------- ROUTES -------------------- */
// Module 3: Employee Payroll Profile
const payrollProfileRoutes = require('./routes/payrollProfileRoutes.js');
app.use('/api/payroll-profile', payrollProfileRoutes);

/* -------------------- DEFAULT ROUTE -------------------- */
app.get('/', (req, res) => {
  res.status(200).send('Payroll Management System API running');
});

/* -------------------- GLOBAL ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message
  });
});

/* -------------------- SERVER START -------------------- */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
