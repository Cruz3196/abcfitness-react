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
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const tabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: BarChart3
        },
        {
            id: 'users',
            label: 'Users',
            icon: Users
        },
        {
            id: 'products',
            label: 'Products',
            icon: Package
        },
        {
            id: 'orders',
            label: 'Orders',
            icon: ShoppingBag
        },
        {
            id: 'trainers',
            label: 'Trainers',
            icon: Dumbbell
        },
        {
            id: 'classes',
            label: 'Classes',
            icon: Calendar
        }
    ];

    return (
        <motion.div className="tabs tabs-boxed mb-8 bg-base-300 p-1" variants={itemVariants}>
            {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        className={`tab tab-lg gap-2 transition-all duration-200 ${
                            activeTab === tab.id 
                                ? 'tab-active bg-primary text-primary-content shadow-lg' 
                                : 'hover:bg-base-200 hover:shadow-md'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
                    </button>
                );
            })}
        </motion.div>
    );
};

export { TabNavigation };