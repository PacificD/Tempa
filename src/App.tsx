import { useState, useMemo } from 'react';
import { StockInput } from './components/StockInput';
import { PortfolioSummary } from './components/PortfolioSummary';
import { CurrencySwitcher } from './components/CurrencySwitcher';
import { AIInsights } from './components/AIInsights';
import type { Stock, PortfolioItem, Currency } from './types';


import PieChart from './components/PieChart';

// Mock exchange rates relative to USD
const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  HKD: 7.8,
  CNY: 7.2,
  JPY: 150,
  EUR: 0.92,
};

// Mock stock prices in USD
const MOCK_PRICES: Record<string, number> = {
  AAPL: 180,
  MSFT: 400,
  GOOGL: 140,
  AMZN: 170,
  TSLA: 200,
  NVDA: 900,
  META: 480,
  BABA: 75,
  TCEHY: 40,
};

// Generate a consistent color from a string
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

// Pre-defined nice colors for charts
const CHART_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#06b6d4', '#6366f1', '#a855f7'
];

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [currency, setCurrency] = useState<Currency>('USD');


  const handleAddStock = (symbol: string, amount: number) => {
    // Mock price fetching
    const basePriceUSD = MOCK_PRICES[symbol] || (Math.random() * 200 + 50); // Fallback random price

    const newStock: Stock = {
      id: Math.random().toString(36).substr(2, 9),
      symbol,
      amount,
      price: basePriceUSD, // Store price in USD
      currency: 'USD', // Indicate that the stored price is in USD
    };

    setStocks(prev => [...prev, newStock]);
  };

  const handleRemoveStock = (id: string) => {
    setStocks(prev => prev.filter(s => s.id !== id));
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  };


  const portfolioData = useMemo(() => {
    // Calculate items first
    const items: PortfolioItem[] = stocks.map((stock, index) => {
      // stock.price is stored in USD
      const currentPrice = stock.price * EXCHANGE_RATES[currency];
      const value = currentPrice * stock.amount;

      return {
        ...stock,
        price: currentPrice,
        value,
        color: CHART_COLORS[index % CHART_COLORS.length] || stringToColor(stock.symbol),
        currency // Update currency to selected
      };
    });

    const total = items.reduce((sum, item) => sum + item.value, 0);

    return items.map(item => ({
      ...item,
      percent: total > 0 ? item.value / total : 0
    })).sort((a, b) => b.value - a.value); // Sort by value desc
  }, [stocks, currency]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Portfolio Visualizer
            </h1>
            <p className="text-slate-500 mt-1">Track your asset allocation in real-time</p>
          </div>
          <CurrencySwitcher
            currentCurrency={currency}
            onCurrencyChange={handleCurrencyChange}
          />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Chart */}
          <PieChart portfolioData={portfolioData} currency={currency} />
        

          {/* Right Column: Input & Summary */}
          <div className="lg:col-span-5 space-y-8">

            {/* Add Stock */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Add Holding</h2>
              <StockInput onAddStock={handleAddStock} />
            </div>

            {/* Summary List */}
            <PortfolioSummary
              items={portfolioData}
              currency={currency}
              onRemove={handleRemoveStock}
            />
          </div>
        </div>
        
        {/* AI Insights Section */}
        <AIInsights items={portfolioData} currency={currency} />
      </div>
    </div>
  );
}

export default App;
