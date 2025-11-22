export type Currency = 'USD' | 'HKD' | 'CNY' | 'JPY' | 'EUR';

export interface Stock {
    id: string;
    symbol: string;
    amount: number; // Number of shares
    price: number; // Price per share (mocked for now)
    currency: Currency;
}

export interface PortfolioItem extends Stock {
    value: number; // Total value in selected currency
    color: string;
    [key: string]: any;
}
