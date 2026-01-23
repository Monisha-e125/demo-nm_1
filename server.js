const path = require('path');

require('dotenv').config({ quiet: true });

const payrollProfileRoutes = require('./routes/payrollProfileRoutes');

require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config({ quiet: true });
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect MongoDB
connectDB();


// Routes (use the same path once you fix models/middlewares)
const authRoutes = require('./routes/auth');
const superAdminRoutes = require('./routes/roleRoutes/superAdmin');
const payrollAdminRoutes = require('./routes/roleRoutes/payroll-Admin');
const hrAdminRoutes = require('./routes/roleRoutes/hrAdmin');
const employeeRoutes = require('./routes/roleRoutes/employee');
const financeRoutes = require('./routes/roleRoutes/finance');


app.use('/api/payroll-profiles', payrollProfileRoutes);



// Health check

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', module: 'User Roles & Access Control' });
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (CSS, JS, login.html from public/)
app.use(express.static(path.join(__dirname, 'public')));

const payrollRunRoutes = require('./routes/payrollRunRoutes');
app.use('/api/payroll', payrollRunRoutes);

// Redirect root / → /pages/login.html
app.get('/', (req, res) => {
  res.redirect('/pages/login.html');
});

// // MongoDB (modern syntax)
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.log('MongoDB error:', err));



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/statutory', require('./routes/statutoryRoutes'));
app.use('/api/employees', require('./routes/roleRoutes/employee'));
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/payrolladmin', payrollAdminRoutes);
app.use('/api/hradmin', hrAdminRoutes);







app.use('/api/finance', financeRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Payroll Backend running on http://localhost:${PORT}`);
});
