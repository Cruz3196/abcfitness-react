import React from 'react';
import { motion } from 'framer-motion';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';

const RevenueChart = ({ dashboardStats }) => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const revenueData = [
        {
            name: 'Product Revenue',
            value: dashboardStats?.financials?.totalProductRevenue || 0,
            color: '#0088FE'
        },
        {
            name: 'Class Revenue',
            value: dashboardStats?.financials?.totalClassRevenue || 0,
            color: '#00C49F'
        }
    ];

    return (
        <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
            <div className="card-body">
                <h3 className="card-title mb-4">Revenue Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                            formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                            {revenueData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export { RevenueChart };