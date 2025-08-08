const sampleData = require('../data/sampleData');

// Moved the helper function here to keep all calculation logic together.
const calculateHoldingMetrics = (holding) => {
  const { quantity, avgPrice, currentPrice } = holding;
  const value = quantity * currentPrice;
  const gainLoss = (currentPrice - avgPrice) * quantity;
  const gainLossPercent = (gainLoss / (avgPrice * quantity)) * 100;

  return {
    ...holding,
    value: parseFloat(value.toFixed(2)),
    gainLoss: parseFloat(gainLoss.toFixed(2)),
    gainLossPercent: parseFloat(gainLossPercent.toFixed(2)),
  };
};

// This is the middleware function.
// It calculates metrics for all holdings and attaches the result to the request object.
const processPortfolioData = (req, res, next) => {
  try {
    req.holdingsWithMetrics = sampleData.holdings.map(calculateHoldingMetrics);
    next(); // This passes control to the actual route handler (e.g., in portfolio.js)
  } catch (error) {
    console.error('Error processing portfolio data in middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while processing portfolio data',
    });
  }
};

module.exports = { processPortfolioData };