
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Configuration } from './components/Configuration';
import { TradeHistory } from './components/TradeHistory';
import { News } from './components/News';
import { View, BotStatus, BotConfig, Trade } from './types';
import { generateNewTrade, generateMockTrades } from './utils/mockData';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [botStatus, setBotStatus] = useState<BotStatus>(BotStatus.Stopped);
  const [trades, setTrades] = useState<Trade[]>(generateMockTrades(100));
  const [config, setConfig] = useState<BotConfig>({
    strategy: 'Grid',
    tradingPair: 'BTC/USDT',
    investment: 1000,
    gridLevels: 10,
    gridStep: 1,
    takeProfit: 5,
    stopLoss: 2,
  });

  useEffect(() => {
    let tradeInterval: NodeJS.Timeout | undefined;
    if (botStatus === BotStatus.Running) {
      tradeInterval = setInterval(() => {
        setTrades(prevTrades => [generateNewTrade(prevTrades[0]), ...prevTrades]);
      }, 5000);
    }
    return () => {
      if (tradeInterval) {
        clearInterval(tradeInterval);
      }
    };
  }, [botStatus]);

  const handleStartBot = () => setBotStatus(BotStatus.Running);
  const handleStopBot = () => setBotStatus(BotStatus.Stopped);

  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard trades={trades} />;
      case View.Configuration:
        return <Configuration config={config} setConfig={setConfig} />;
      case View.TradeHistory:
        return <TradeHistory trades={trades} />;
      case View.News:
        return <News />;
      default:
        return <Dashboard trades={trades} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <div className="flex flex-col flex-1">
        <Header botStatus={botStatus} onStart={handleStartBot} onStop={handleStopBot} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
