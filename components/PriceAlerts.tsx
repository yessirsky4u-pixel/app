
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { PriceAlert } from '../types';
import { BellIcon, XCircleIcon } from './icons/Icons';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { AlertNotification } from './AlertNotification';

export const PriceAlerts: React.FC = () => {
    const [alerts, setAlerts] = useState<PriceAlert[]>([
        { id: '1', coin: 'BTC', targetPrice: 68000, condition: 'above', isActive: true },
        { id: '2', coin: 'ETH', targetPrice: 3500, condition: 'below', isActive: true },
    ]);
    const [showForm, setShowForm] = useState(false);
    const [newAlert, setNewAlert] = useState({ coin: 'BTC', targetPrice: '', condition: 'above' as 'above' | 'below' });
    const [triggeredAlert, setTriggeredAlert] = useState<PriceAlert | null>(null);

    const handleAddAlert = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAlert.coin || !newAlert.targetPrice) return;
        
        const alertToAdd: PriceAlert = {
            id: `alert-${Date.now()}`,
            coin: newAlert.coin,
            targetPrice: parseFloat(newAlert.targetPrice),
            condition: newAlert.condition,
            isActive: true,
        };
        setAlerts(prev => [...prev, alertToAdd]);
        
        // Mock triggering an alert for demo
        if(alerts.length === 2) {
           setTimeout(() => setTriggeredAlert(alertToAdd), 2000);
        }

        setShowForm(false);
        setNewAlert({ coin: 'BTC', targetPrice: '', condition: 'above' });
    };

    const handleRemoveAlert = (id: string) => {
        setAlerts(alerts.filter(alert => alert.id !== id));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewAlert(prev => ({...prev, [name]: value}));
    }

    return (
        <>
            <Card className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center">
                        <BellIcon className="w-6 h-6 text-primary mr-3" />
                        <h3 className="text-lg font-semibold text-white">Price Alerts</h3>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)} className="text-xs px-2 py-1">{showForm ? 'Cancel' : 'Add New'}</Button>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-3">
                    {showForm && (
                        <form onSubmit={handleAddAlert} className="p-3 bg-gray-900 rounded-md space-y-3">
                           <Input label="Coin Symbol" name="coin" value={newAlert.coin} onChange={handleChange} placeholder="e.g. BTC" />
                           <Input label="Target Price (USDT)" name="targetPrice" type="number" value={newAlert.targetPrice} onChange={handleChange} placeholder="e.g. 70000" />
                           <Select label="Condition" name="condition" value={newAlert.condition} onChange={handleChange}>
                               <option value="above">Goes Above</option>
                               <option value="below">Drops Below</option>
                           </Select>
                           <Button type="submit" className="w-full bg-primary hover:bg-sky-600">Set Alert</Button>
                        </form>
                    )}
                    {alerts.map(alert => (
                        <div key={alert.id} className="flex items-center justify-between p-2 bg-gray-700 rounded-md">
                            <div>
                                <span className="font-bold text-white">{alert.coin}</span>
                                <span className="text-sm text-gray-400"> {alert.condition === 'above' ? '>' : '<'} ${alert.targetPrice.toLocaleString()}</span>
                            </div>
                            <button onClick={() => handleRemoveAlert(alert.id)} className="text-gray-500 hover:text-negative">
                                <XCircleIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    ))}
                    {alerts.length === 0 && !showForm && <p className="text-sm text-gray-500 text-center py-4">No active alerts.</p>}
                </div>
            </Card>
            {triggeredAlert && (
                 <AlertNotification
                    alert={triggeredAlert}
                    onClose={() => setTriggeredAlert(null)}
                />
            )}
        </>
    );
};
