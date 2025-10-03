import React from 'react';
import { motion } from 'framer-motion';
import { 
    LineChart,
    Line,
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const MonthlyTrendsChart = ({ monthlyData }) => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const defaultMonthlyData = [
        { month: 'Jan', users: 45, revenue: 2400, classes: 12 },
        { month: 'Feb', users: 52, revenue: 1398, classes: 15 },
        { month: 'Mar', users: 48, revenue: 9800, classes: 18 },
        { month: 'Apr', users: 61, revenue: 3908, classes: 20 },
        { month: 'May', users: 55, revenue: 4800, classes: 22 },
        { month: 'Jun', users: 67, revenue: 3800, classes: 25 },
    ];

    const data = monthlyData || defaultMonthlyData;

    return (
        <motion.div className="card bg-base-100 shadow-lg mb-8" variants={itemVariants}>
            <div className="card-body">
                <h3 className="card-title mb-4">Monthly Trends</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="users" fill="#8884d8" name="New Users" />
                        <Line 
                            yAxisId="right" 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#82ca9d" 
                            strokeWidth={3}
                            name="Revenue ($)" 
                        />
                        <Line 
                            yAxisId="left" 
                            type="monotone" 
                            dataKey="classes" 
                            stroke="#ffc658" 
                            strokeWidth={2}
                            name="Classes Created" 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export { MonthlyTrendsChart };