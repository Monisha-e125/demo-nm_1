const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. MIDDLEWARE (CRITICAL ORDER!)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 2. STATIC FILES FIRST
app.use(express.static('public'));

// 3. ROOT ROUTE
app.get('/', (req, res) => {
  res.redirect('/pages/login.html');
});

// 4. API ROUTES
app.use('/api/auth', require('./routes/auth'));

// ❌ NEVER USE app.use('*' ) IN EXPRESS V5!
// ✅ EXPRESS V5 CORRECT 404 HANDLER (NO WILDCARD)
app.use((req, res, next) => {
  // Only 404 for API calls
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  // Static files already handled above
  res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
});
