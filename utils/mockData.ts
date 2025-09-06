
import { Trade, TradeType, PerformanceDataPoint } from '../types';

export const generateNewTrade = (lastTrade?: Trade): Trade => {
    const basePrice = lastTrade ? lastTrade.price : 50000;
    const priceChange = (Math.random() - 0.48) * (basePrice * 0.01); // Price change biased slightly upwards
    const price = basePrice + priceChange;
    const type = Math.random() > 0.5 ? TradeType.Buy : TradeType.Sell;
    const amount = Math.random() * 0.1;
    const total = price * amount;
    
    // Simplified PnL logic for sells, assuming a recent buy price
    const pnl = type === TradeType.Sell 
        ? (price - (basePrice - (Math.random() * 100))) * amount 
        : undefined;

    return {
      id: `trade-${Date.now()}-${Math.random()}`,
      pair: 'BTC/USDT',
      type,
      price: parseFloat(price.toFixed(2)),
      amount: parseFloat(amount.toFixed(5)),
      total: parseFloat(total.toFixed(2)),
      timestamp: new Date(),
      pnl: pnl ? parseFloat(pnl.toFixed(2)) : undefined,
    };
};


export const generateMockTrades = (count: number): Trade[] => {
  const trades: Trade[] = [];
  let lastPrice = 50000;
  let holdings = 0;
  let totalPnl = 0;

  for (let i = 0; i < count; i++) {
    const type = Math.random() > 0.5 ? TradeType.Buy : TradeType.Sell;
    const priceChange = (Math.random() - 0.5) * 1000;
    const price = lastPrice + priceChange;
    const amount = Math.random() * 0.1;
    const total = price * amount;
    
    let pnl: number | undefined = undefined;

    if (type === TradeType.Sell && holdings > amount) {
        pnl = (price - (lastPrice - 500)) * amount; // simplified PnL calculation
        totalPnl += pnl;
        holdings -= amount;
    } else if (type === TradeType.Buy) {
        holdings += amount;
    }

    trades.push({
      id: `trade-${i}`,
      pair: 'BTC/USDT',
      type,
      price: parseFloat(price.toFixed(2)),
      amount: parseFloat(amount.toFixed(5)),
      total: parseFloat(total.toFixed(2)),
      timestamp: new Date(Date.now() - (count - i) * 60 * 60 * 1000),
      pnl: pnl ? parseFloat(pnl.toFixed(2)) : undefined,
    });
    lastPrice = price;
  }
  return trades.reverse();
};

export const generatePerformanceData = (trades: Trade[]): PerformanceDataPoint[] => {
    let cumulativeValue = 1000; // Starting portfolio value
    const data: PerformanceDataPoint[] = [{ name: 'Start', value: cumulativeValue }];
    
    [...trades].reverse().forEach((trade, index) => {
        if (trade.pnl) {
            cumulativeValue += trade.pnl;
        } else {
            // Simulate small portfolio fluctuations on non-realizing trades
            cumulativeValue += (Math.random() - 0.5) * 10;
        }
        data.push({
            name: `Trade ${index + 1}`,
            value: parseFloat(cumulativeValue.toFixed(2)),
        });
    });

    return data;
};
