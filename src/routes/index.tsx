import { useState, useMemo, useEffect } from 'react';
import { createRoute } from '@tanstack/react-router';
import { StockInput } from '../components/StockInput';
import { PortfolioSummary } from '../components/PortfolioSummary';
import { CurrencySwitcher } from '../components/CurrencySwitcher';
import { AIInsights } from '../components/AIInsights';
import PieChart from '../components/PieChart';
import { supabase } from '../lib/supabase';
import type { Stock, PortfolioItem, Currency } from '../types';
import { rootRoute } from './__root';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});

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

function Index() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*');
      
      if (error) throw error;

      if (data) {
        const mappedStocks: Stock[] = data.map((item: any) => ({
          id: item.id,
          symbol: item.symbol,
          amount: Number(item.amount),
          price: MOCK_PRICES[item.symbol] || (Math.random() * 200 + 50),
          currency: 'USD',
        }));
        setStocks(mappedStocks);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStock = async (symbol: string, amount: number) => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert([{ symbol, amount }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const basePriceUSD = MOCK_PRICES[symbol] || (Math.random() * 200 + 50);
        const newStock: Stock = {
          id: data.id,
          symbol: data.symbol,
          amount: Number(data.amount),
          price: basePriceUSD,
          currency: 'USD',
        };
        setStocks(prev => [...prev, newStock]);
      }
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  const handleRemoveStock = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStocks(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error removing stock:', error);
    }
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  };

  const portfolioData = useMemo(() => {
    const items: PortfolioItem[] = stocks.map((stock, index) => {
      const currentPrice = stock.price * EXCHANGE_RATES[currency];
      const value = currentPrice * stock.amount;

      return {
        ...stock,
        price: currentPrice,
        value,
        color: CHART_COLORS[index % CHART_COLORS.length] || stringToColor(stock.symbol),
        currency
      };
    });

    const total = items.reduce((sum, item) => sum + item.value, 0);

    return items.map(item => ({
      ...item,
      percent: total > 0 ? item.value / total : 0
    })).sort((a, b) => b.value - a.value);
  }, [stocks, currency]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading portfolio...</div>;
  }

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
          <div className="flex items-center gap-4">
            <CurrencySwitcher 
              currentCurrency={currency} 
              onCurrencyChange={handleCurrencyChange} 
            />
            <button 
              onClick={() => supabase.auth.signOut()}
              className="text-sm text-slate-500 hover:text-slate-700 font-medium"
            >
              Sign Out
            </button>
          </div>
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
