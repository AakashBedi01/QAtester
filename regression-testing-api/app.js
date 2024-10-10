import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import flowRoutes from './routes/flowRoutes.js';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost/regression_test_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });

// Routes
app.use('/api', flowRoutes);
app.use('/api/flows', flowRoutes);

// Serve static files from the React app
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'regression-ui/build')));

app.get('/api/test-report', (req, res) => {
  // Dummy data for now, replace with actual report fetching logic
  const report = {
    passed: 5,
    failed: 2,
    details: {
      failedTests: [
        { testName: 'Test A', reason: 'Error in step 3' },
        { testName: 'Test B', reason: 'Timeout occurred' },
      ],
    },
  };
  res.json(report);
});

export default app;
