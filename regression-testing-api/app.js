// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection (remove deprecated options)
mongoose.connect('mongodb://localhost/regression_test_db')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
const flowRoutes = require('./routes/flowRoutes');
app.use('/api/flows', flowRoutes);
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'regression-ui/build')));

// Fallback to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'regression-ui/build', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;
