import { TrendingUp, TrendingDown, Shield, Target } from 'lucide-react';

interface TopPerformersProps {
  summary: {
    topPerformer: {
      symbol: string;
      name: string;
      gainLossPercent: number;
    };
    worstPerformer: {
      symbol: string;
      name: string;
      gainLossPercent: number;
    };
    diversificationScore: number;
    riskLevel: string;
  };
}

export default function TopPerformers({ summary }: TopPerformersProps) {
  const formatPercentage = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  // Updated helper functions for dark theme
  const getRiskLevelClasses = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return 'text-green-400 bg-green-500/10';
      case 'moderate':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'high':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-foreground/70 bg-foreground/10';
    }
  };

  const getDiversificationColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getDiversificationText = (score: number) => {
    if (score >= 70) return 'Well Diversified';
    if (score >= 50) return 'Moderately Diversified';
    return 'Needs Diversification';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top & Worst Performers Card */}
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 space-y-4">
        <div>
            <h3 className="text-lg font-semibold text-foreground">Top & Worst Performers</h3>
            <p className="text-sm text-foreground/80 mt-1">Best and worst performing stocks</p>
        </div>

        {/* Best Performer */}
        <div className="flex items-center justify-between py-4 border-b border-border/50">
          <div className="flex items-center space-x-4">
            <TrendingUp className="w-6 h-6 text-green-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground">{summary.topPerformer.symbol}</h4>
              <p className="text-sm text-foreground/70 truncate">{summary.topPerformer.name}</p>
            </div>
          </div>
          <p className="text-lg font-bold text-green-400">
            {formatPercentage(summary.topPerformer.gainLossPercent)}
          </p>
        </div>

        {/* Worst Performer */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <TrendingDown className="w-6 h-6 text-red-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground">{summary.worstPerformer.symbol}</h4>
              <p className="text-sm text-foreground/70 truncate">{summary.worstPerformer.name}</p>
            </div>
          </div>
          <p className="text-lg font-bold text-red-400">
            {formatPercentage(summary.worstPerformer.gainLossPercent)}
          </p>
        </div>
      </div>

      {/* Portfolio Insights Card */}
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 space-y-4">
        <div>
            <h3 className="text-lg font-semibold text-foreground">Portfolio Insights</h3>
            <p className="text-sm text-foreground/80 mt-1">Risk and diversification analysis</p>
        </div>

        {/* Diversification Score */}
        <div className="py-4 border-b border-border/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
                <Target className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-foreground">Diversification</h4>
                    <p className="text-sm text-foreground/70">{getDiversificationText(summary.diversificationScore)}</p>
                </div>
            </div>
            <p className="text-lg font-bold text-foreground">{summary.diversificationScore.toFixed(1)}/100</p>
          </div>
          <div className="mt-3">
            <div className="w-full bg-foreground/10 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getDiversificationColor(summary.diversificationScore)}`}
                style={{ width: `${summary.diversificationScore}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Risk Level */}
        <div className="py-4">
           <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Shield className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-foreground">Risk Level</h4>
                        <p className="text-sm text-foreground/70">Overall portfolio assessment</p>
                    </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelClasses(summary.riskLevel)}`}>
                    {summary.riskLevel}
                </span>
            </div>
        </div>
      </div>
    </div>
  );
}