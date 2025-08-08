// backend/routes/portfolio.js

const express = require('express');
const router = express.Router();
const sampleData = require('../data/sampleData');
const { processPortfolioData } = require('../middleware/portfolioMiddleware'); // Import the new middleware

// (The calculateHoldingMetrics function is no longer needed here as it's in the middleware file)

//this is holdings endpoint which lists all your stocks with their calculated matrices in simple language
//value, gain/loss, gain/loss %
router.get('/holdings', processPortfolioData, (req, res) => { // <-- Middleware is added here
  try {
    // The calculation is already done! We just get the data from the request object.
    const { holdingsWithMetrics } = req;

    res.status(200).json({
      success: true,
      data: holdingsWithMetrics,
      count: holdingsWithMetrics.length,
    });
  } catch (error) {
    console.error('Error fetching holdings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching holdings',
    });
  }
});

// Sole purpose of this endpoint is to show how your portfolio's value segregation is done. for ex total portfolio value is 100000
// so this api results in value dostributed across different sectors and market caps.
router.get('/allocation', processPortfolioData, (req, res) => { // <-- Middleware is added here
  try {
    const { holdingsWithMetrics } = req; // Get pre-calculated data

    // Calculate total portfolio value for percentage calculations
    const totalValue = holdingsWithMetrics.reduce((sum, holding) => sum + holding.value, 0);

    // Group by sector and calculate allocation
    const sectorAllocation = {};
    const marketCapAllocation = {};

    holdingsWithMetrics.forEach((holding) => {
      // Sector allocation
      if (!sectorAllocation[holding.sector]) {
        sectorAllocation[holding.sector] = { value: 0, percentage: 0 };
      }
      sectorAllocation[holding.sector].value += holding.value;

      // Market cap allocation
      if (!marketCapAllocation[holding.marketCap]) {
        marketCapAllocation[holding.marketCap] = { value: 0, percentage: 0 };
      }
      marketCapAllocation[holding.marketCap].value += holding.value;
    });

    // Calculate percentages and format values
    Object.keys(sectorAllocation).forEach((sector) => {
      sectorAllocation[sector].value = parseFloat(sectorAllocation[sector].value.toFixed(2));
      sectorAllocation[sector].percentage = parseFloat(
        ((sectorAllocation[sector].value / totalValue) * 100).toFixed(2)
      );
    });

    Object.keys(marketCapAllocation).forEach((marketCap) => {
      marketCapAllocation[marketCap].value = parseFloat(
        marketCapAllocation[marketCap].value.toFixed(2)
      );
      marketCapAllocation[marketCap].percentage = parseFloat(
        ((marketCapAllocation[marketCap].value / totalValue) * 100).toFixed(2)
      );
    });

    res.status(200).json({
      success: true,
      data: {
        bySector: sectorAllocation,
        byMarketCap: marketCapAllocation,
        totalValue: parseFloat(totalValue.toFixed(2)),
      },
    });
  } catch (error) {
    console.error('Error calculating allocation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while calculating allocation',
    });
  }
});

// GET /api/portfolio/performance gets data for performance chart (historic data and comparison).
router.get('/performance', (req, res) => {
  // This route doesn't need the holding metrics, so no middleware is used.
  try {
    res.status(200).json({
      success: true,
      data: sampleData.performance,
    });
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching performance data',
    });
  }
});

// getting overall nuymbers of entire portfolio of individuals.
// calculates currentVale, totalgainlosspercentage, sorts on basis of totalgainlosspercentage
//finally finds the top performer
// diversificationScore shows how many unique sectors you're invested in.
router.get('/summary', processPortfolioData, (req, res) => { // <-- Middleware is added here
  try {
    const { holdingsWithMetrics } = req; // Get pre-calculated data

    // Calculate total portfolio value
    const totalValue = holdingsWithMetrics.reduce((sum, holding) => sum + holding.value, 0);

    // Calculate total invested amount
    const totalInvested = holdingsWithMetrics.reduce(
      (sum, holding) => sum + holding.avgPrice * holding.quantity,
      0
    );

    // Calculate total gain/loss
    const totalGainLoss = totalValue - totalInvested;
    const totalGainLossPercent = (totalGainLoss / totalInvested) * 100;

    // Find top and worst performers
    const sortedByPerformance = [...holdingsWithMetrics].sort(
      (a, b) => b.gainLossPercent - a.gainLossPercent
    );
    const topPerformer = sortedByPerformance[0];
    const worstPerformer = sortedByPerformance[sortedByPerformance.length - 1];

    // Calculate diversification score (number of unique sectors out of 10 possible)
    const uniqueSectors = new Set(sampleData.holdings.map((h) => h.sector));
    const diversificationScore = (uniqueSectors.size / 10) * 100;

    // Risk level assessment (hardcoded as per requirements)
    const riskLevel = 'Moderate';

    res.status(200).json({
      success: true,
      data: {
        totalValue: parseFloat(totalValue.toFixed(2)),
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        totalGainLoss: parseFloat(totalGainLoss.toFixed(2)),
        totalGainLossPercent: parseFloat(totalGainLossPercent.toFixed(2)),
        numberOfHoldings: holdingsWithMetrics.length,
        topPerformer: {
          symbol: topPerformer.symbol,
          name: topPerformer.name,
          gainLossPercent: topPerformer.gainLossPercent,
        },
        worstPerformer: {
          symbol: worstPerformer.symbol,
          name: worstPerformer.name,
          gainLossPercent: worstPerformer.gainLossPercent,
        },
        diversificationScore: parseFloat(diversificationScore.toFixed(1)),
        riskLevel,
      },
    });
  } catch (error) {
    console.error('Error calculating portfolio summary:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while calculating portfolio summary',
    });
  }
});

module.exports = router;