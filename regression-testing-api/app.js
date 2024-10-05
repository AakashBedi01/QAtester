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
app.get('/api/test-report', (req, res) => {
  // Dummy data for now, replace with actual report fetching logic
  const report = {
    passed: 5,
    failed: 2,
    details: {
      failedTests: [
        { testName: 'Test 1', error: 'Button not found', screenshot: 'error_screenshot.png' },
        { testName: 'Test 2', error: 'Timeout', screenshot: null }
      ]
    }
  };

  res.json(report);
});

// Fallback to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'regression-ui/build', 'index.html'));
});

module.exports = app;
