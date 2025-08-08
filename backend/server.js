const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const portfolioRoutes = require('./routes/portfolio');

const app = express();
const PORT = process.env.PORT || 10000;

// Security middleware
app.use(helmet());

// CORS configuration - allow requests from frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

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
