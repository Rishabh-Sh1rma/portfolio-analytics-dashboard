import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AllocationChartsProps {
  allocation: {
    bySector: Record<string, { value: number; percentage: number }>;
    byMarketCap: Record<string, { value: number; percentage: number }>;
    totalValue: number;
  };
}

export default function AllocationCharts({ allocation }: AllocationChartsProps) {
  // A new, more sophisticated color palette for the dark theme
  const themeColors = [
    '#F59E0B', // Gold (Primary)
    '#6B7280', // Gray
    '#3B82F6', // Blue
    '#10B981', // Green
    '#84CC16', // Lime
    '#EF4444', // Red
    '#8B5CF6', // Purple
  ];

  // Transform data for charts
  const sectorData = Object.entries(allocation.bySector).map(([sector, data]) => ({
    name: sector,
    value: data.value,
    percentage: data.percentage,
  }));

  const marketCapData = Object.entries(allocation.byMarketCap).map(([marketCap, data]) => ({
    name: marketCap,
    value: data.value,
    percentage: data.percentage,
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border border-border rounded-lg shadow-lg">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-foreground/80">
            Value: {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-foreground/80">
            Percentage: {data.percentage.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    if (percentage < 5) return null; // Don't show labels for small slices

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Sector Distribution Card */}
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Sector Distribution</h3>
          <p className="text-sm text-foreground/80 mt-1">Portfolio allocation by industry sectors</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                dataKey="value"
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={themeColors[index % themeColors.length]} stroke={""} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
          {sectorData.map((entry, index) => (
            <div key={entry.name} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: themeColors[index % themeColors.length] }}
              />
              <span className="text-sm text-foreground/90 truncate">{entry.name}</span>
              <span className="text-sm text-foreground/70 ml-auto">{entry.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Market Cap Distribution Card */}
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Market Cap Distribution</h3>
          <p className="text-sm text-foreground/80 mt-1">Portfolio allocation by company size</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={marketCapData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                dataKey="value"
              >
                {marketCapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={themeColors[index % themeColors.length]} stroke={""} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-3">
          {marketCapData.map((entry, index) => (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: themeColors[index % themeColors.length] }}
                />
                <span className="text-sm text-foreground/90">{entry.name} Cap</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-foreground">{formatCurrency(entry.value)}</span>
                <span className="text-sm text-foreground/70 ml-2">({entry.percentage.toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}