import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Configuration } from './components/Configuration';
import { TradeHistory } from './components/TradeHistory';
import { News } from './components/News';
import { BotStatus, Trade, BotConfig, View } from './types';
// Fix: Import `generatePerformanceData` to resolve the "Cannot find name" error.
import { generateMockTrades, generateNewTrade, generatePerformanceData } from './utils/mockData';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const [botStatus, setBotStatus] = useState<BotStatus>(BotStatus.Stopped);
  const [trades, setTrades] = useState<Trade[]>(generateMockTrades(50));
  const [config, setConfig] = useState<BotConfig>({
    tradingPair: 'BTC/USDT',
    strategy: 'Grid',
    gridLevels: 10,
    gridStep: 0.5,
    takeProfit: 2,
    stopLoss: 5,
    investment: 1000,
  });

  useEffect(() => {
    if (botStatus === BotStatus.Running) {
      const intervalId = setInterval(() => {
        setTrades(prevTrades => {
          const newTrade = generateNewTrade(prevTrades[0]);
          // Cap the total number of trades to avoid performance degradation
          const updatedTrades = [newTrade, ...prevTrades].slice(0, 200);
          return updatedTrades;
        });
      }, 3000); // Generate a new trade every 3 seconds

      return () => clearInterval(intervalId); // Cleanup on stop or unmount
    }
  }, [botStatus]);

  const performanceData = useMemo(() => generatePerformanceData(trades), [trades]);

  const handleStartBot = () => setBotStatus(BotStatus.Running);
  const handleStopBot = () => setBotStatus(BotStatus.Stopped);

  const renderView = () => {
    switch (view) {
      case View.Dashboard:
        return <Dashboard botStatus={botStatus} performanceData={performanceData} trades={trades} />;
      case View.Configuration:
        return <Configuration config={config} setConfig={setConfig} />;
      case View.TradeHistory:
        return <TradeHistory trades={trades} />;
      case View.News:
        return <News />;
      default:
        return <Dashboard botStatus={botStatus} performanceData={performanceData} trades={trades}/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      <Sidebar currentView={view} setView={setView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header botStatus={botStatus} onStart={handleStartBot} onStop={handleStopBot} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
