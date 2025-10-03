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

const ProductCategoriesChart = ({ products, categories }) => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

    if (!products || products.length === 0) {
        return (
            <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                <div className="card-body">
                    <h3 className="card-title mb-4">Product Categories</h3>
                    <div className="text-center py-8">
                        <p className="text-base-content/70">No products available to analyze.</p>
                    </div>
                </div>
            </motion.div>
        );
    }

    const categoryData = categories.map((category, index) => ({
        name: category,
        count: products.filter(p => p.productCategory === category).length,
        color: COLORS[index % COLORS.length]
    })).filter(item => item.count > 0);

    return (
        <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
            <div className="card-body">
                <h3 className="card-title mb-4">Product Categories</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0088FE">
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export { ProductCategoriesChart };