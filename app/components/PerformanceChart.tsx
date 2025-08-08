import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
  performance: {
    timeline: Array<{
      date: string;
      portfolio: number;
      nifty50: number;
      gold: number;
    }>;
    returns: {
      portfolio: { "1month": number; "3months": number; "1year": number };
      nifty50: { "1month": number; "3months": number; "1year": number };
      gold: { "1month": number; "3months": number; "1year": number };
    };
  };
}

// Color mapping to be used in both chart and returns section
const performanceColors = {
    Portfolio: 'hsl(var(--primary))', // Gold
    'Nifty 50': '#10B981',             // Green
    Gold: '#6B7280',                   // Gray
};

export default function PerformanceChart({ performance }: PerformanceChartProps) {
  const chartData = performance.timeline.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    Portfolio: item.portfolio,
    'Nifty 50': item.nifty50,
    Gold: item.gold,
  }));

  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const formatReturn = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-4 border border-border rounded-lg shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-foreground/80">{entry.dataKey}:</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {entry.dataKey === 'Portfolio'
                  ? formatCurrency(entry.value)
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const ReturnBlock = ({ title, returns }: { title: keyof typeof performanceColors, returns: { "1month": number; "3months": number; "1year": number } }) => (
    <div>
        <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: performanceColors[title]}}></div>
            <h5 className="font-medium text-foreground">{title}</h5>
        </div>
        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-foreground/70">1 Month:</span>
                <span className="font-semibold text-foreground">{formatReturn(returns["1month"])}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-foreground/70">3 Months:</span>
                <span className="font-semibold text-foreground">{formatReturn(returns["3months"])}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-foreground/70">1 Year:</span>
                <span className="font-semibold text-foreground">{formatReturn(returns["1year"])}</span>
            </div>
        </div>
    </div>
  );

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Performance Comparison</h3>
        <p className="text-sm text-foreground/80 mt-1">Portfolio performance vs market benchmarks</p>
      </div>

      <div className="h-80 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--foreground))"
              opacity={0.6}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--foreground))"
              opacity={0.6}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Legend iconType="circle" />
            <Line
              type="monotone"
              dataKey="Portfolio"
              stroke={performanceColors.Portfolio}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="Nifty 50"
              stroke={performanceColors['Nifty 50']}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="Gold"
              stroke={performanceColors.Gold}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="text-md font-semibold text-foreground mb-4">Returns Comparison</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReturnBlock title="Portfolio" returns={performance.returns.portfolio} />
            <ReturnBlock title="Nifty 50" returns={performance.returns.nifty50} />
            <ReturnBlock title="Gold" returns={performance.returns.gold} />
        </div>
      </div>
    </div>
  );
}