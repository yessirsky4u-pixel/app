
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { BotStatus, Trade, PerformanceDataPoint, TradeType } from '../types';
import { Card } from './ui/Card';
import {ArrowTrendingUpIcon, ArrowTrendingDownIcon} from './icons/Icons';
import { MarketOverview } from './MarketOverview';

interface DashboardProps {
  botStatus: BotStatus;
  performanceData: PerformanceDataPoint[];
  trades: Trade[];
}

const MetricCard: React.FC<{ title: string; value: string; change?: string; isPositive?: boolean }> = ({ title, value, change, isPositive }) => (
    <Card className="p-4">
        <div className="text-sm text-gray-400">{title}</div>
        <div className="text-2xl font-bold text-white">{value}</div>
        {change && (
            <div className={`flex items-center text-sm ${isPositive ? 'text-positive' : 'text-negative'}`}>
                {isPositive ? <ArrowTrendingUpIcon className="w-4 h-4 mr-1" /> : <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />}
                {change}
            </div>
        )}
    </Card>
);


export const Dashboard: React.FC<DashboardProps> = ({ botStatus, performanceData, trades }) => {
    const pnlTrades = trades.filter(t => t.pnl !== undefined);
    const totalPnl = pnlTrades.reduce((acc, trade) => acc + (trade.pnl || 0), 0);
    const positivePnlTrades = pnlTrades.filter(t => t.pnl && t.pnl > 0).length;
    const winRate = pnlTrades.length > 0 ? (positivePnlTrades / pnlTrades.length) * 100 : 0;
    const totalTrades = trades.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Total P/L" value={`$${totalPnl.toFixed(2)}`} change="+5.2% vs last period" isPositive={totalPnl >= 0}/>
          <MetricCard title="Win Rate" value={`${winRate.toFixed(1)}%`} isPositive={winRate >= 50}/>
          <MetricCard title="Total Trades" value={totalTrades.toString()} />
          <MetricCard title="Bot Status" value={botStatus} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
            <Card className="p-4 h-96">
                <h3 className="text-lg font-semibold mb-4 text-white">Portfolio Performance</h3>
                <ResponsiveContainer width="100%" height="calc(100% - 3rem)">
                    <AreaChart data={performanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                        <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} hide/>
                        <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} domain={['dataMin - 100', 'dataMax + 100']} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #3c3c3c' }} />
                        <Area type="monotone" dataKey="value" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2}/>
                    </AreaChart>
                </ResponsiveContainer>
            </Card>
        </div>
        <div className="h-96">
            <MarketOverview />
        </div>
      </div>
      
      <Card>
        <h3 className="text-lg font-semibold p-4 text-white">Recent Trades</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pair</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">P/L ($)</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {trades.slice(0, 10).map((trade) => (
                        <tr key={trade.id} className="hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{trade.timestamp.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{trade.pair}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${trade.type === TradeType.Buy ? 'text-positive' : 'text-negative'}`}>{trade.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${trade.price.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{trade.amount.toFixed(5)}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${trade.pnl ? (trade.pnl > 0 ? 'text-positive' : 'text-negative') : 'text-gray-400'}`}>
                                {trade.pnl ? trade.pnl.toFixed(2) : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};
