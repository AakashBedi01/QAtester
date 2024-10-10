import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { limiter } from './middlewares/rateLimiter.js';
import flowRoutes from './routes/flowRoutes.js';

// Initialize express app
const app = express();

// Security: Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet());

// Enable CORS (allow requests from different domains)
app.use(cors());

// Body parser: Parse incoming request bodies in a middleware before handlers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser: Needed for CSRF protection
app.use(cookieParser());

// CSRF Protection Middleware
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Rate Limiting: Apply to all requests
app.use(limiter);

// Log middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/flows', flowRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    // CSRF token validation failed
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
