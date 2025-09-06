
import React, { useEffect } from 'react';
import { PriceAlert } from '../types';
import { InformationCircleIcon, XCircleIcon } from './icons/Icons';

interface AlertNotificationProps {
  alert: PriceAlert;
  onClose: () => void;
}

export const AlertNotification: React.FC<AlertNotificationProps> = ({ alert, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 w-full max-w-sm bg-gray-800 border border-primary shadow-lg rounded-lg pointer-events-auto overflow-hidden animate-fade-in-up">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-white">
              Price Alert Triggered!
            </p>
            <p className="mt-1 text-sm text-gray-300">
              {alert.coin} has gone {alert.condition} ${alert.targetPrice.toLocaleString()}.
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XCircleIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
