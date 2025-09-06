
import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { MarketSummary } from '../types';
import { getMarketSummary } from '../services/geminiService';
import { GlobeAltIcon, LinkIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from './icons/Icons';

export const MarketOverview: React.FC = () => {
    const [summary, setSummary] = useState<MarketSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getMarketSummary();
                setSummary(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMarketData();
    }, []);
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            );
        }
        
        if (error) {
            return <div className="text-negative text-sm p-4">{error}</div>;
        }

        if (!summary || summary.coins.length === 0) {
            return <div className="text-gray-400 text-sm p-4">No market data available.</div>;
        }

        return (
            <div className="flex flex-col h-full">
                <ul className="divide-y divide-gray-700 flex-1">
                    {summary.coins.map(coin => (
                        <li key={coin.symbol} className="flex justify-between items-center p-3">
                            <div>
                                <div className="font-bold text-white">{coin.name}</div>
                                <div className="text-sm text-gray-400">{coin.symbol}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold text-white">${coin.price.toLocaleString()}</div>
                                <div className={`flex items-center justify-end text-sm font-semibold ${coin.change24h >= 0 ? 'text-positive' : 'text-negative'}`}>
                                    {coin.change24h >= 0 ? <ArrowTrendingUpIcon className="w-4 h-4 mr-1" /> : <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />}
                                    {coin.change24h.toFixed(2)}%
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                {summary.sources.length > 0 && (
                     <div className="p-3 border-t border-gray-700 mt-auto">
                        <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center">
                           <LinkIcon className="w-3 h-3 mr-1.5"/> Data Sources
                        </h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {summary.sources.map((source, index) => (
                                <a href={source.web.uri} key={index} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate">
                                    {source.web.title}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    };

    return (
        <Card className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-700 flex items-center">
                <GlobeAltIcon className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-lg font-semibold text-white">Market Overview</h3>
            </div>
            <div className="flex-grow overflow-y-auto">
                {renderContent()}
            </div>
        </Card>
    );
};
