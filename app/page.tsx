// app/page.tsx

'use client'

import { useState, useEffect } from 'react';
import PortfolioOverview from './components/PortfolioOverview';
import HoldingsTable from './components/HoldingsTable';
import AllocationCharts from './components/AllocationCharts';
import PerformanceChart from './components/PerformanceChart';
import TopPerformers from './components/TopPerformers';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { Landmark, Activity } from 'lucide-react';

interface DashboardData {
  summary: any;
  holdings: any[];
  allocation: any;
  performance: any;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [summaryRes, holdingsRes, allocationRes, performanceRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/portfolio/summary`),
          fetch(`${API_BASE_URL}/api/portfolio/holdings`),
          fetch(`${API_BASE_URL}/api/portfolio/allocation`),
          fetch(`${API_BASE_URL}/api/portfolio/performance`),
        ]);

        if (!summaryRes.ok || !holdingsRes.ok || !allocationRes.ok || !performanceRes.ok) {
          throw new Error('Failed to fetch one or more portfolio endpoints');
        }

        // IMPORTANT FIX: Your backend API returns an object with a 'data' key.
        // We need to extract the data from each response.
        const summaryJson = await summaryRes.json();
        const holdingsJson = await holdingsRes.json();
        const allocationJson = await allocationRes.json();
        const performanceJson = await performanceRes.json();

        setData({
          summary: summaryJson.data,
          holdings: holdingsJson.data,
          allocation: allocationJson.data,
          performance: performanceJson.data,
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load portfolio data. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="No data available to display." />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Landmark className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Wealth Manager Portfolio Assignment</h1>
                <p className="text-sm text-foreground/70">Investment Dashboard</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-foreground/70">Last Updated</p>
              <p className="text-sm font-medium text-foreground">
                {new Date().toLocaleDateString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <PortfolioOverview summary={data.summary} />
          <PerformanceChart performance={data.performance} />
          <AllocationCharts allocation={data.allocation} />
          <TopPerformers summary={data.summary} />
          <HoldingsTable holdings={data.holdings} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground/70">
              © {new Date().getFullYear()} Made By : 
            </p>
            <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-foreground/70">Rishabh Sharma</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}