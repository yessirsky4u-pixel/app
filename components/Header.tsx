
import React from 'react';
import { BotStatus } from '../types';
import { PlayIcon, StopIcon } from './icons/Icons';

interface HeaderProps {
  botStatus: BotStatus;
  onStart: () => void;
  onStop: () => void;
}

const StatusIndicator: React.FC<{ status: BotStatus }> = ({ status }) => {
  const baseClasses = "w-4 h-4 rounded-full";
  const statusConfig = {
    [BotStatus.Running]: { color: 'bg-positive', text: 'Running' },
    [BotStatus.Stopped]: { color: 'bg-negative', text: 'Stopped' },
    [BotStatus.Error]: { color: 'bg-yellow-500', text: 'Error' },
  };
  const { color, text } = statusConfig[status];

  return (
    <div className="flex items-center space-x-2">
      <div className={`${baseClasses} ${color}`}></div>
      <span className="font-semibold text-white">{text}</span>
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({ botStatus, onStart, onStop }) => {
  const isRunning = botStatus === BotStatus.Running;

  return (
    <header className="flex items-center justify-between h-20 px-6 lg:px-8 bg-gray-800 border-b border-gray-700 flex-shrink-0">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-white">Trading Bot Control</h2>
      </div>
      <div className="flex items-center space-x-4">
        <StatusIndicator status={botStatus} />
        <button
          onClick={onStart}
          disabled={isRunning}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-positive rounded-md hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          <PlayIcon className="w-5 h-5 mr-2"/>
          Start Bot
        </button>
        <button
          onClick={onStop}
          disabled={!isRunning}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-negative rounded-md hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          <StopIcon className="w-5 h-5 mr-2"/>
          Stop Bot
        </button>
      </div>
    </header>
  );
};
