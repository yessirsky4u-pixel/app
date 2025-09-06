
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { getStrategySuggestion } from '../services/geminiService';
import { BotConfig } from '../types';
import { LightBulbIcon } from './icons/Icons';

interface StrategyAdvisorProps {
    onApplySuggestion: (suggestion: Partial<BotConfig>) => void;
}

export const StrategyAdvisor: React.FC<StrategyAdvisorProps> = ({ onApplySuggestion }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestion, setSuggestion] = useState<Partial<BotConfig> | null>(null);

    const handleGenerate = async () => {
        if (!prompt) {
            setError('Please describe your trading goals.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuggestion(null);

        try {
            const result = await getStrategySuggestion(prompt);
            setSuggestion(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="p-6">
            <div className="flex items-center mb-4">
                <LightBulbIcon className="w-6 h-6 text-yellow-400 mr-2"/>
                <h3 className="text-lg font-bold text-white">Gemini Strategy Advisor</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
                Describe your trading style and risk tolerance. Gemini will suggest a bot configuration for you.
            </p>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'A safe, long-term grid strategy for BTC with low investment.'"
                className="w-full h-24 p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
                disabled={isLoading}
            />
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4 bg-primary hover:bg-sky-600">
                {isLoading ? 'Generating...' : 'Generate Suggestion'}
            </Button>
            
            {error && <p className="text-negative text-sm mt-4">{error}</p>}
            
            {suggestion && (
                <div className="mt-6 p-4 bg-gray-800 rounded-md border border-gray-700">
                    <h4 className="font-semibold text-white mb-2">Suggestion Received:</h4>
                    <ul className="text-sm space-y-1 text-gray-300">
                        {Object.entries(suggestion).map(([key, value]) => (
                             <li key={key}><span className="font-medium capitalize text-gray-400">{key.replace(/([A-Z])/g, ' $1')}:</span> {value}</li>
                        ))}
                    </ul>
                    <Button onClick={() => onApplySuggestion(suggestion)} className="w-full mt-4">
                        Apply Suggestion
                    </Button>
                </div>
            )}
        </Card>
    );
};
