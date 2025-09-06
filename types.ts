import { GroundingChunk as GenAIGroundingChunk } from "@google/genai";

export enum BotStatus {
  Running = 'Running',
  Stopped = 'Stopped',
  Error = 'Error',
}

export enum TradeType {
  Buy = 'Buy',
  Sell = 'Sell',
}

export enum View {
    Dashboard = 'Dashboard',
    Configuration = 'Configuration',
    TradeHistory = 'Trade History',
    News = 'News',
}

export interface Trade {
  id: string;
  pair: string;
  type: TradeType;
  price: number;
  amount: number;
  total: number;
  timestamp: Date;
  pnl?: number;
}

export interface PerformanceDataPoint {
  name: string;
  value: number;
}

export interface BotConfig {
  tradingPair: string;
  strategy: 'Grid' | 'DCA' | 'RSI';
  investment: number;
  gridLevels?: number;
  gridStep?: number;
  takeProfit?: number;
  stopLoss?: number;
}

export interface MarketCoin {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface MarketSummary {
    coins: MarketCoin[];
    sources: GroundingChunk[];
}

export interface NewsArticle {
    title: string;
    summary: string;
    source: string;
    url: string;
}

export interface NewsResponse {
    articles: NewsArticle[];
    sources: GroundingChunk[];
}
