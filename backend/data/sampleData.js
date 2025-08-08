// Sample portfolio data - serves as the single source of truth for all calculations
const sampleData = {
  holdings: [
    { symbol: "RELIANCE", name: "Reliance Industries Ltd", quantity: 50, avgPrice: 2450.00, currentPrice: 2830.50, sector: "Energy", marketCap: "Large" },
    { symbol: "TCS", name: "Tata Consultancy Services", quantity: 75, avgPrice: 3200.00, currentPrice: 3850.25, sector: "Technology", marketCap: "Large" },
    { symbol: "HDFCBANK", name: "HDFC Bank Ltd", quantity: 100, avgPrice: 1550.00, currentPrice: 1480.75, sector: "Banking", marketCap: "Large" },
    { symbol: "INFY", name: "Infosys Limited", quantity: 120, avgPrice: 1400.00, currentPrice: 1655.50, sector: "Technology", marketCap: "Large" },
    { symbol: "ICICIBANK", name: "ICICI Bank Ltd", quantity: 150, avgPrice: 980.00, currentPrice: 1150.00, sector: "Banking", marketCap: "Large" },
    { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", quantity: 200, avgPrice: 850.00, currentPrice: 1210.80, sector: "Telecommunication", marketCap: "Large" },
    { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries Ltd", quantity: 80, avgPrice: 1100.00, currentPrice: 1495.00, sector: "Healthcare", marketCap: "Mid" },
    { symbol: "TATAMOTORS", name: "Tata Motors Ltd", quantity: 250, avgPrice: 650.00, currentPrice: 975.30, sector: "Automobile", marketCap: "Mid" },
    { symbol: "ADANIPORTS", name: "Adani Ports & SEZ Ltd", quantity: 180, avgPrice: 780.00, currentPrice: 1350.60, sector: "Infrastructure", marketCap: "Mid" },
    { symbol: "ZOMATO", name: "Zomato Ltd", quantity: 500, avgPrice: 120.00, currentPrice: 185.20, sector: "Technology", marketCap: "Small" },
  ],
  performance: {
    timeline: [
      { date: "2024-01-01", portfolio: 1298500, nifty50: 21741, gold: 63280 },
      { date: "2024-03-01", portfolio: 1450200, nifty50: 22326, gold: 64550 },
      { date: "2024-06-01", portfolio: 1680500, nifty50: 22530, gold: 71950 },
      { date: "2024-08-01", portfolio: 1858485, nifty50: 23537, gold: 72800 },
    ],
    returns: {
      portfolio: { "1month": 3.1, "3months": 10.6, "1year": 25.4 },
      nifty50: { "1month": 2.8, "3months": 5.4, "1year": 18.9 },
      gold: { "1month": 0.5, "3months": 11.2, "1year": 15.1 },
    }
  }
};

module.exports = sampleData;
