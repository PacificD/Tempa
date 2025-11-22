import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import type { PortfolioItem, Currency } from '../types';
import { cn } from '../lib/utils';

interface AIInsightsProps {
  items: PortfolioItem[];
  currency: Currency;
  className?: string;
}

export function AIInsights({ items, currency, className }: AIInsightsProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const handleAnalyze = async () => {
    const keyToUse = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!keyToUse) {
      setShowKeyInput(true);
      return;
    }

    if (items.length === 0) {
      setAnalysis("Please add some stocks to your portfolio first so I can analyze them.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const genAI = new GoogleGenerativeAI(keyToUse);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

      const totalValue = items.reduce((sum, item) => sum + item.value, 0);
      const portfolioSummary = items.map(item => 
        `- ${item.symbol}: ${item.amount} shares, Value: ${currency} ${item.value.toFixed(2)} (${((item.value / totalValue) * 100).toFixed(1)}%)`
      ).join('\n');

      const prompt = `
        You are a senior financial portfolio analyst. Analyze the following stock portfolio:
        
        Portfolio Base Currency: ${currency}
        Total Portfolio Value: ${currency} ${totalValue.toFixed(2)}
        
        Holdings:
        ${portfolioSummary}
        
        Please provide a concise, professional analysis covering:
        1. Diversification Assessment: Is the portfolio well-balanced?
        2. Sector Risks: Infer sectors from common symbols (e.g., AAPL is Tech).
        3. Actionable Suggestions: 1-2 brief recommendations.
        
        Format your response with clear headings and bullet points. 
        Do NOT use markdown bolding (**) or italics (*). 
        Use plain text and standard bullet points (•) for readability.
        Keep the tone professional but accessible.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setAnalysis(text);
    } catch (err: unknown) {
      console.error("AI Analysis failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage || "Failed to generate analysis. Please check your API key and try again.");
      if (errorMessage.includes("API key")) {
        setShowKeyInput(true);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={cn("bg-white p-6 rounded-2xl shadow-sm border border-slate-100", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Sparkles className="text-indigo-600" size={20} />
          AI Insights
        </h3>
        {!isAnalyzing && !analysis && (
          <button
            onClick={handleAnalyze}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md active:scale-95 flex items-center gap-2"
          >
            <Sparkles size={16} />
            Analyze Portfolio
          </button>
        )}
      </div>

      {showKeyInput && !analysis && !isAnalyzing && (
        <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <label className="block text-sm font-medium text-indigo-900 mb-2">
            Enter Gemini API Key
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 px-3 py-2 rounded-md border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button
              onClick={handleAnalyze}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Save & Analyze
            </button>
          </div>
          <p className="text-xs text-indigo-600 mt-2">
            Key is used only for this session and not stored permanently.
          </p>
        </div>
      )}

      {isAnalyzing && (
        <div className="py-8 flex flex-col items-center justify-center text-slate-500">
          <Loader2 size={32} className="animate-spin text-indigo-600 mb-3" />
          <p className="text-sm font-medium">Analyzing portfolio composition...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 text-sm">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {analysis && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="prose prose-slate prose-sm max-w-none bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
              {analysis}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyze}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
            >
              Refresh Analysis
            </button>
          </div>
        </div>
      )}
      
      {!analysis && !isAnalyzing && !showKeyInput && (
        <div className="p-8 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm text-center">
          Unlock personalized insights about your portfolio's diversification and potential risks using Gemini AI.
        </div>
      )}
    </div>
  );
}
