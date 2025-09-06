import React from 'react';
import { View } from '../types';
import { ChartPieIcon, Cog6ToothIcon, TableCellsIcon, BoltIcon, NewspaperIcon } from './icons/Icons';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: View;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-white bg-primary'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: View.Dashboard, icon: <ChartPieIcon className="w-6 h-6" /> },
    { view: View.Configuration, icon: <Cog6ToothIcon className="w-6 h-6" /> },
    { view: View.TradeHistory, icon: <TableCellsIcon className="w-6 h-6" /> },
    { view: View.News, icon: <NewspaperIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-800 border-r border-gray-700">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <BoltIcon className="w-8 h-8 text-primary" />
        <h1 className="ml-2 text-2xl font-bold text-white">Bot UI</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.view}
            isActive={currentView === item.view}
            onClick={() => setView(item.view)}
          />
        ))}
      </nav>
    </div>
  );
};
