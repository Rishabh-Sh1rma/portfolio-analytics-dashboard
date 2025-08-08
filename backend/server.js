const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const portfolioRoutes = require('./routes/portfolio');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// --- THIS IS THE PERMANENT FIX ---
const corsOptions = {
  origin: function (origin, callback) {
    // This function checks if the incoming request origin is allowed.
    // We will allow requests from localhost for development,
    // and any URL that matches our Vercel deployment pattern.

    // Regex to match any of your Vercel deployment URLs
    const vercelPattern = /^https:\/\/portfolio-analytics-dashboard-.*\.vercel\.app$/;

    // Allow localhost or any matching Vercel URL
    if (!origin || origin === 'http://localhost:3000' || vercelPattern.test(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
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