import { TrendingUp, TrendingDown, DollarSign, PieChart, Component } from 'lucide-react';

interface PortfolioOverviewProps {
  summary: {
    totalValue: number;
    totalGainLoss: number;
    totalGainLossPercent: number;
    numberOfHoldings: number;
  };
}

// Reusable Metric Card Sub-Component
const MetricCard = ({
  title,
  value,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconClass?: string;
}) => (
  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground/80">{title}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
      </div>
      <div className={`flex items-center justify-center w-12 h-12 bg-background/50 rounded-lg ${iconClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

export default function PortfolioOverview({ summary }: PortfolioOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const isPositiveGain = summary.totalGainLoss >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Portfolio Value"
        value={formatCurrency(summary.totalValue)}
        icon={DollarSign}
        iconClass="text-primary" // Gold
      />

      <MetricCard
        title="Total Gain/Loss"
        value={formatCurrency(summary.totalGainLoss)}
        icon={isPositiveGain ? TrendingUp : TrendingDown}
        iconClass={isPositiveGain ? 'text-green-400' : 'text-red-400'}
      />

      <MetricCard
        title="Portfolio Performance"
        value={formatPercentage(summary.totalGainLossPercent)}
        icon={isPositiveGain ? TrendingUp : TrendingDown}
        iconClass={isPositiveGain ? 'text-green-400' : 'text-red-400'}
      />

      <MetricCard
        title="Number of Holdings"
        value={summary.numberOfHoldings}
        icon={PieChart}
        iconClass="text-foreground/70" // Neutral gray
      />
    </div>
  );
}