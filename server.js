require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

/* middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* serve static frontend */
app.use(express.static(path.join(__dirname, 'public')));

/* routes */
app.use('/api/auth', require('./routes/auth'));

/* mongodb */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error:', err.message));

/* server */
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
