import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
  sector: string;
  marketCap: string;
}

interface HoldingsTableProps {
  holdings: Holding[];
}

type SortField = keyof Holding;
type SortDirection = 'asc' | 'desc';

export default function HoldingsTable({ holdings }: HoldingsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const filteredAndSortedHoldings = useMemo(() => {
    let filtered = holdings.filter(
      (holding) =>
        holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holding.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [holdings, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) {
      return <ArrowUpDown className="w-4 h-4 text-foreground/50" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-primary" />
    ) : (
      <ArrowDown className="w-4 h-4 text-primary" />
    );
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Holdings</h3>
            <p className="text-sm text-foreground/80 mt-1">
              Detailed view of all your portfolio holdings
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-foreground/60" />
            </div>
            <input
              type="text"
              placeholder="Search stocks..."
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-background/50 placeholder-foreground/50 focus:outline-none focus:placeholder-foreground/40 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-background/20">
            <tr>
              {/* Table Headers */}
              <th
                className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider cursor-pointer hover:bg-foreground/5 transition-colors"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center space-x-1">
                  <span>Symbol</span>
                  {getSortIcon('symbol')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider cursor-pointer hover:bg-foreground/5 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider cursor-pointer hover:bg-foreground/5 transition-colors"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center space-x-1">
                  <span>Quantity</span>
                  {getSortIcon('quantity')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider cursor-pointer hover:bg-foreground/5 transition-colors"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center space-x-1">
                  <span>Value</span>
                  {getSortIcon('value')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider cursor-pointer hover:bg-foreground/5 transition-colors"
                onClick={() => handleSort('gainLoss')}
              >
                <div className="flex items-center space-x-1">
                  <span>Gain/Loss</span>
                  {getSortIcon('gainLoss')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider cursor-pointer hover:bg-foreground/5 transition-colors"
                onClick={() => handleSort('gainLossPercent')}
              >
                <div className="flex items-center space-x-1">
                  <span>Gain/Loss %</span>
                  {getSortIcon('gainLossPercent')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredAndSortedHoldings.map((holding) => (
              <tr key={holding.symbol} className="hover:bg-foreground/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">{holding.symbol}</div>
                  <div className="text-xs text-foreground/70">{holding.sector}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground max-w-xs truncate" title={holding.name}>
                    {holding.name}
                  </div>
                  <div className="text-xs text-foreground/70">{holding.marketCap} Cap</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/90">
                  {holding.quantity.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  {formatCurrency(holding.value)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {formatCurrency(holding.gainLoss)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={holding.gainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {formatPercentage(holding.gainLossPercent)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedHoldings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-foreground/70">No holdings found matching your search.</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-foreground/80">
            Showing {filteredAndSortedHoldings.length} of {holdings.length} holdings
          </span>
          <span className="text-foreground/80">
            Total Value:{' '}
            <span className="font-semibold text-foreground">
              {formatCurrency(
                filteredAndSortedHoldings.reduce((sum, holding) => sum + holding.value, 0)
              )}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}