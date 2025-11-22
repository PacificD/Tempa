import { useCallback,useRef, type FC } from "react";
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { PortfolioChart } from '../components/PortfolioChart';
import type { Currency, PortfolioItem } from "../types";

interface IProps {
    portfolioData: PortfolioItem[];
    currency: Currency;
}


const PieChart: FC<IProps> = ({portfolioData,currency}) => {
      const chartRef = useRef<HTMLDivElement>(null);
      
      const handleExportChart = useCallback(async () => {
        if (chartRef.current === null) {
          return;
        }
    
        try {
          const dataUrl = await toPng(chartRef.current, { cacheBust: true, backgroundColor: '#ffffff' });
          const link = document.createElement('a');
          link.download = 'portfolio-allocation.png';
          link.href = dataUrl;
          link.click();
        } catch (err) {
          console.error('Failed to export chart', err);
        }
      }, [chartRef]);
    

    return (
         <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                   <div className="flex items-center justify-between mb-6">
                     <h2 className="text-lg font-semibold text-slate-800">Allocation</h2>
                     <button
                       onClick={handleExportChart}
                       className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                       title="Export as PNG"
                     >
                       <Download size={20} />
                     </button>
                   </div>
                   <div ref={chartRef} className="flex-1 min-h-[400px] flex items-center justify-center bg-white rounded-xl">
                     <PortfolioChart data={portfolioData} currency={currency} />
                   </div>
                 </div>
    )
}

export default PieChart