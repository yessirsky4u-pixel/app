
import React, { useState } from 'react';
import { BotConfig } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { StrategyAdvisor } from './StrategyAdvisor';

interface ConfigurationProps {
  config: BotConfig;
  setConfig: React.Dispatch<React.SetStateAction<BotConfig>>;
}

export const Configuration: React.FC<ConfigurationProps> = ({ config, setConfig }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: name === 'strategy' ? value : parseFloat(value) || value }));
    setIsSaved(false);
  };
  
  const handleSave = () => {
    console.log("Configuration saved:", config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleApplySuggestion = (suggestion: Partial<BotConfig>) => {
    setConfig(prev => ({ ...prev, ...suggestion }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Bot Configuration</h2>
            <p className="text-gray-400 mb-6">Adjust the parameters for your trading strategy. API Keys are managed securely on the server-side and are not accessible here.</p>
          </div>
          <div className="p-6 border-t border-gray-700">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select label="Strategy" name="strategy" value={config.strategy} onChange={handleChange}>
                      <option>Grid</option>
                      <option>DCA</option>
                      <option>RSI</option>
                  </Select>
                  <Input label="Trading Pair" name="tradingPair" value={config.tradingPair} onChange={handleChange} />
              </div>
              <Input label="Total Investment (USDT)" name="investment" type="number" value={config.investment} onChange={handleChange} />

              {config.strategy === 'Grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-700 rounded-md">
                      <h3 className="col-span-full font-semibold text-primary">Grid Strategy Parameters</h3>
                      <Input label="Grid Levels" name="gridLevels" type="number" value={config.gridLevels ?? ''} onChange={handleChange} />
                      <Input label="Grid Step (%)" name="gridStep" type="number" value={config.gridStep ?? ''} onChange={handleChange} />
                  </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Take Profit (%)" name="takeProfit" type="number" value={config.takeProfit ?? ''} onChange={handleChange} />
                  <Input label="Stop Loss (%)" name="stopLoss" type="number" value={config.stopLoss ?? ''} onChange={handleChange} />
              </div>

              <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} className="bg-primary hover:bg-sky-600">
                      {isSaved ? 'Saved!' : 'Save Configuration'}
                  </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div>
        <StrategyAdvisor onApplySuggestion={handleApplySuggestion} />
      </div>
    </div>
  );
};
