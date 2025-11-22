import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface StockInputProps {
    onAddStock: (symbol: string, amount: number) => void;
    className?: string;
}

export function StockInput({ onAddStock, className }: StockInputProps) {
    const [symbol, setSymbol] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (symbol && amount) {
            onAddStock(symbol.toUpperCase(), Number(amount));
            setSymbol('');
            setAmount('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cn("flex gap-4 items-end", className)}>
            <div className="flex-1">
                <label htmlFor="symbol" className="block text-sm font-medium text-slate-700 mb-1">
                    Stock Symbol
                </label>
                <input
                    type="text"
                    id="symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="e.g. AAPL"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                />
            </div>
            <div className="flex-1">
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
                    Amount (Shares)
                </label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 10"
                    min="1"
                    step="any"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                />
            </div>
            <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md active:scale-95"
            >
                Add
            </button>
        </form>
    );
}
