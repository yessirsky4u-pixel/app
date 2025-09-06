import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { NewsResponse } from '../types';
import { getCryptoNews } from '../services/geminiService';
import { NewspaperIcon, LinkIcon } from './icons/Icons';

export const News: React.FC = () => {
    const [news, setNews] = useState<NewsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNewsData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getCryptoNews();
                setNews(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchNewsData();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            );
        }

        if (error) {
            return <div className="text-negative text-center bg-red-900/20 p-4 rounded-lg">{error}</div>;
        }

        if (!news || news.articles.length === 0) {
            return <div className="text-gray-400 text-center p-4">No news articles found.</div>;
        }

        return (
            <div className="space-y-6">
                {news.articles.map((article, index) => (
                    <Card key={index} className="p-5 hover:border-primary/50 transition-colors">
                        <h3 className="text-lg font-bold text-white mb-2">{article.title}</h3>
                        <p className="text-sm text-gray-300 mb-4">{article.summary}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-400 uppercase">{article.source}</span>
                            <a 
                                href={article.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                            >
                                Read More
                            </a>
                        </div>
                    </Card>
                ))}

                {news.sources.length > 0 && (
                     <div className="p-4 border-t border-gray-700 mt-4">
                        <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center">
                           <LinkIcon className="w-4 h-4 mr-2"/> Data Sources
                        </h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {news.sources.map((source, index) => (
                                <a href={source.web.uri} key={index} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                                    {source.web.title}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            <div className="mb-6 flex items-center">
                <NewspaperIcon className="w-8 h-8 text-primary mr-3" />
                <h1 className="text-2xl font-bold text-white">Latest Crypto News</h1>
            </div>
            {renderContent()}
        </div>
    );
};
