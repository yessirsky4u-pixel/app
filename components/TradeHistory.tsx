
import React, { useState } from 'react';
import { Trade, TradeType } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface TradeHistoryProps {
  trades: Trade[];
}

const ROWS_PER_PAGE = 15;

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(trades.length / ROWS_PER_PAGE);

    const paginatedTrades = trades.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    const goToNextPage = () => {
        setCurrentPage((page) => Math.min(page + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((page) => Math.max(page - 1, 1));
    };

  return (
    <Card>
      <h2 className="text-xl font-bold text-white p-6">Full Trade History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pair</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price ($)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total ($)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">P/L ($)</th>
                </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
                {paginatedTrades.map((trade) => (
                    <tr key={trade.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{trade.timestamp.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{trade.pair}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${trade.type === TradeType.Buy ? 'text-positive' : 'text-negative'}`}>{trade.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{trade.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{trade.amount.toFixed(5)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{trade.total.toFixed(2)}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${trade.pnl ? (trade.pnl > 0 ? 'text-positive' : 'text-negative') : 'text-gray-400'}`}>
                            {trade.pnl ? trade.pnl.toFixed(2) : '-'}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
       <div className="flex justify-between items-center p-4 border-t border-gray-700">
            <div>
                <p className="text-sm text-gray-400">
                    Showing <span className="font-medium">{(currentPage - 1) * ROWS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ROWS_PER_PAGE, trades.length)}</span> of <span className="font-medium">{trades.length}</span> results
                </p>
            </div>
            <div className="space-x-2">
                <Button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</Button>
                <Button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</Button>
            </div>
        </div>
    </Card>
  );
};
