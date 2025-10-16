import React from 'react';
import { motion } from 'framer-motion';
import { 
    BarChart3, 
    Users, 
    Package, 
    ShoppingBag, 
    Dumbbell, 
    Calendar 
} from 'lucide-react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'users', label: 'Users' },
        { id: 'products', label: 'Products' },
        { id: 'orders', label: 'Orders' },
        { id: 'trainers', label: 'Trainers' },
        { id: 'classes', label: 'Classes' }
    ];

    return (
        <div className="tabs mb-8 overflow-x-auto justify-center">
            {tabs.map((tab) => (
                <a
                        key={tab.id}
                        className={`tab tab-bordered whitespace-nowrap flex-1 sm:flex-none ${activeTab === tab.id ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                    {tab.label}
                </a>
            ))}
        </div>
    );
};

export { TabNavigation };