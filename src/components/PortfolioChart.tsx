import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { PortfolioItem, Currency } from '../types';

interface PortfolioChartProps {
    data: PortfolioItem[];
    currency: Currency;
}

const CustomTooltip = ({ active, payload, currency }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-100">
                <p className="font-bold text-slate-800">{data.symbol}</p>
                <p className="text-slate-600">
                    {data.amount} shares
                </p>
                <p className="text-blue-600 font-medium">
                    {currency} {data.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                    {((data.percent || 0) * 100).toFixed(1)}% of portfolio
                </p>
            </div>
        );
    }
    return null;
};

export function PortfolioChart({ data, currency }: PortfolioChartProps) {
    if (data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                Add stocks to see visualization
            </div>
        );
    }

    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={140}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip currency={currency} />} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
