
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Trade, PerformanceDataPoint, TradeType } from '../types';
import { Card } from './ui/Card';
import { MarketOverview } from './MarketOverview';
import { generatePerformanceData } from '../utils/mockData';
import { PriceAlerts } from './PriceAlerts';

interface DashboardProps {
  trades: Trade[];
}

const RecentTrades: React.FC<{ trades: Trade[] }> = ({ trades }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-white p-4 border-b border-gray-700">Recent Trades</h3>
      <div className="overflow-y-auto h-80">
        <table className="min-w-full">
          <tbody className="divide-y divide-gray-700">
            {trades.slice(0, 15).map(trade => (
              <tr key={trade.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{trade.timestamp.toLocaleTimeString()}</td>
                <td className={`px-4 py-2 whitespace-nowrap text-sm font-semibold ${trade.type === TradeType.Buy ? 'text-positive' : 'text-negative'}`}>{trade.type}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">${trade.price.toFixed(2)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{trade.amount.toFixed(5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const PerformanceChart: React.FC<{ data: PerformanceDataPoint[] }> = ({ data }) => {
  return (
    <Card className="p-4 h-96">
      <h3 className="text-lg font-semibold text-white mb-4">Portfolio Performance</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="name" stroke="#A0AEC0" tick={{ fontSize: 12 }} />
          <YAxis stroke="#A0AEC0" tick={{ fontSize: 12 }} domain={['dataMin - 100', 'dataMax + 100']} />
          <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#38BDF8" strokeWidth={2} dot={false} name="Portfolio Value (USDT)" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ trades }) => {
  const performanceData = generatePerformanceData(trades);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <PerformanceChart data={performanceData} />
        <RecentTrades trades={trades} />
      </div>
      <div className="space-y-8">
        <MarketOverview />
        <PriceAlerts />
      </div>
    </div>
  );
};
