const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const portfolioRoutes = require('./routes/portfolio');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// --- THIS IS THE UPDATED PART ---
// CORS configuration to allow requests from multiple specific frontends
const allowedOrigins = [
  'http://localhost:3000', // For local development
  'https://portfolio-analytics-dashboard-i5owepq65-rishabhsh1rmas-projects.vercel.app', // Old Vercel URL (can keep for now)
  'https://portfolio-analytics-dashboard-zeta.vercel.app' // *** ADD THIS NEW VERCEL URL ***
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));
// --- UPDATE ENDS HERE ---

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio Analytics API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/portfolio', portfolioRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio Analytics API server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

module.exports = app;