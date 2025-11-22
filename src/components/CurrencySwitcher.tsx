import type { Currency } from '../types';
import { cn } from '../lib/utils';

interface CurrencySwitcherProps {
    currentCurrency: Currency;
    onCurrencyChange: (currency: Currency) => void;
    className?: string;
}

const CURRENCIES: Currency[] = ['USD', 'HKD', 'CNY', 'JPY', 'EUR'];

export function CurrencySwitcher({ currentCurrency, onCurrencyChange, className }: CurrencySwitcherProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <span className="text-sm font-medium text-slate-500">Currency:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
                {CURRENCIES.map((currency) => (
                    <button
                        key={currency}
                        onClick={() => onCurrencyChange(currency)}
                        className={cn(
                            "px-3 py-1 text-sm rounded-md transition-all font-medium cursor-pointer",
                            currentCurrency === currency
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {currency}
                    </button>
                ))}
            </div>
        </div>
    );
}
