
import type { PortfolioItem, Currency } from '../types';
import { cn } from '../lib/utils';

interface PortfolioSummaryProps {
    items: PortfolioItem[];
    currency: Currency;
    onRemove: (id: string) => void;
    className?: string;
}

export function PortfolioSummary({ items, currency, onRemove, className }: PortfolioSummaryProps) {
    const totalValue = items.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className={cn("space-y-6", className)}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Total Portfolio Value</h3>
                <p className="text-4xl font-bold text-slate-900">
                    {currency} {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800 px-1">Holdings</h3>
                {items.length === 0 ? (
                    <p className="text-slate-500 italic px-1">No stocks added yet.</p>
                ) : (
                    <div className="space-y-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-100 hover:shadow-md transition-shadow group"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <div>
                                        <p className="font-bold text-slate-800">{item.symbol}</p>
                                        <p className="text-xs text-slate-500">{item.amount} shares @ {currency} {item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-medium text-slate-900">
                                            {currency} {item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {((item.value / totalValue) * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onRemove(item.id)}
                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                        title="Remove stock"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
