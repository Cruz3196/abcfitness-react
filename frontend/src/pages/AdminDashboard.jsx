import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Package, 
    Calendar, 
    DollarSign, 
    TrendingUp, 
    Settings,
    UserCheck,
    ShoppingBag,
    FileText,
    Eye
} from 'lucide-react';
import { userStore } from '../storeData/userStore';
import { productStore } from '../storeData/productStore';
import ProductForm from '../components/admin/ProductForm';

const AdminDashboard = () => {
    const { user, isAdmin } = userStore();
    const [activeTab, setActiveTab] = useState('overview');
    const { products, categories, isLoading: isLoadingProducts, fetchAllProducts } = productStore();
    const [showProductForm, setShowProductForm] = useState(false);


    // Add debugging at the very beginning
    console.log('AdminDashboard render - user:', user);
    console.log('AdminDashboard render - isAdmin function result:', isAdmin());
    console.log('AdminDashboard render - user.role:', user?.role);

    // Fetch products when Products tab is activated
    useEffect(() => {
        if (activeTab === 'products') {
            fetchAllProducts();
        }
    }, [activeTab, fetchAllProducts]);
        

    // Mock data for admin dashboard
    const stats = {
        totalUsers: 1247,
        totalTrainers: 23,
        totalProducts: 156,
        totalOrders: 89,
        monthlyRevenue: 45670,
        activeClasses: 12
    };

    const recentOrders = [
        { id: '001', customer: 'John Doe', amount: 129.99, status: 'completed', date: '2024-01-15' },
        { id: '002', customer: 'Jane Smith', amount: 89.50, status: 'pending', date: '2024-01-14' },
        { id: '003', customer: 'Mike Johnson', amount: 199.99, status: 'completed', date: '2024-01-14' },
    ];

    const pendingTrainers = [
        { id: '1', name: 'Sarah Wilson', email: 'sarah@example.com', specialty: 'Yoga', status: 'pending' },
        { id: '2', name: 'Tom Brown', email: 'tom@example.com', specialty: 'CrossFit', status: 'pending' },
    ];

    if (!isAdmin()) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="alert alert-error">
                    <span>Access denied. Admin privileges required.</span>
                </div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            className="min-h-screen bg-base-200 py-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div className="mb-8" variants={itemVariants}>
                    <h1 className="text-4xl font-bold text-base-content mb-2">Admin Dashboard</h1>
                    <p className="text-base-content/70">Welcome back, {user?.username}</p>
                </motion.div>

                {/* Tabs */}
                <motion.div className="tabs tabs-boxed mb-8" variants={itemVariants}>
                    <button 
                        className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button 
                        className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                    <button 
                        className={`tab ${activeTab === 'products' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        Products
                    </button>
                    <button 
                        className={`tab ${activeTab === 'orders' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Orders
                    </button>
                    <button 
                        className={`tab ${activeTab === 'trainers' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('trainers')}
                    >
                        Trainers
                    </button>
                </motion.div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <motion.div variants={containerVariants}>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <motion.div className="stat bg-base-100 shadow-lg rounded-lg" variants={itemVariants}>
                                <div className="stat-figure text-primary">
                                    <Users className="w-8 h-8" />
                                </div>
                                <div className="stat-title">Total Users</div>
                                <div className="stat-value text-primary">{stats.totalUsers}</div>
                                <div className="stat-desc">↗︎ 400 (22%) this month</div>
                            </motion.div>

                            <motion.div className="stat bg-base-100 shadow-lg rounded-lg" variants={itemVariants}>
                                <div className="stat-figure text-secondary">
                                    <Package className="w-8 h-8" />
                                </div>
                                <div className="stat-title">Products</div>
                                <div className="stat-value text-secondary">{stats.totalProducts}</div>
                                <div className="stat-desc">↗︎ 12 new this month</div>
                            </motion.div>

                            <motion.div className="stat bg-base-100 shadow-lg rounded-lg" variants={itemVariants}>
                                <div className="stat-figure text-accent">
                                    <DollarSign className="w-8 h-8" />
                                </div>
                                <div className="stat-title">Monthly Revenue</div>
                                <div className="stat-value text-accent">${stats.monthlyRevenue.toLocaleString()}</div>
                                <div className="stat-desc">↗︎ 18% increase</div>
                            </motion.div>
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                                <div className="card-body">
                                    <h2 className="card-title">Recent Orders</h2>
                                    <div className="overflow-x-auto">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Customer</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentOrders.map(order => (
                                                    <tr key={order.id}>
                                                        <td>#{order.id}</td>
                                                        <td>{order.customer}</td>
                                                        <td>${order.amount}</td>
                                                        <td>
                                                            <div className={`badge ${order.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                                                {order.status}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                                <div className="card-body">
                                    <h2 className="card-title">Pending Trainer Approvals</h2>
                                    <div className="space-y-3">
                                        {pendingTrainers.map(trainer => (
                                            <div key={trainer.id} className="flex items-center justify-between p-3 border border-base-300 rounded-lg">
                                                <div>
                                                    <h3 className="font-semibold">{trainer.name}</h3>
                                                    <p className="text-sm text-base-content/70">{trainer.specialty}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="btn btn-sm btn-success">Approve</button>
                                                    <button className="btn btn-sm btn-error">Reject</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="card-title">User Management</h2>
                                <button className="btn btn-primary">Add User</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-12 h-12">
                                                            <img src="https://placehold.co/48x48" alt="User" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">John Doe</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>john@example.com</td>
                                            <td><div className="badge badge-primary">Customer</div></td>
                                            <td><div className="badge badge-success">Active</div></td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button className="btn btn-sm btn-ghost">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="btn btn-sm btn-ghost">
                                                        <Settings className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Products Tab */}
            {activeTab === 'products' && (
                <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="card-title">Product Management</h2>
                            <button 
                                className="btn btn-primary"
                                onClick={() => setShowProductForm(true)}
                            >
                                Add Product
                            </button>
                        </div>
                        
                        {isLoadingProducts ? (
                            <div className="flex justify-center py-8">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-8">
                                <Package className="mx-auto w-16 h-16 text-base-300 mb-2" />
                                <p className="text-base-content/70 mb-4">No products found</p>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => setShowProductForm(true)}
                                >
                                    Add Your First Product
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Category</th>
                                            <th>Featured</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <tr key={product._id}>
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar">
                                                            <div className="mask mask-squircle w-12 h-12">
                                                                <img 
                                                                    src={product.productImage || "https://placehold.co/48x48?text=No+Image"} 
                                                                    alt={product.productName} 
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">{product.productName}</div>
                                                            <div className="text-xs opacity-50 truncate w-48">
                                                                {product.productDescription?.substring(0, 50)}
                                                                {product.productDescription?.length > 50 ? '...' : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>${product.productPrice?.toFixed(2)}</td>
                                                <td>{product.productCategory}</td>
                                                <td>
                                                    {product.isFeatured ? (
                                                        <div className="badge badge-success">Featured</div>
                                                    ) : (
                                                        <div className="badge badge-ghost">Not Featured</div>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        <button className="btn btn-sm btn-ghost">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button className="btn btn-sm btn-ghost">
                                                            <Settings className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                        <div className="card-body">
                            <h2 className="card-title mb-4">Order Management</h2>
                            <p className="text-base-content/70">Order management interface coming soon...</p>
                        </div>
                    </motion.div>
                )}

                {/* Trainers Tab */}
                {activeTab === 'trainers' && (
                    <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                        <div className="card-body">
                            <h2 className="card-title mb-4">Trainer Management</h2>
                            <p className="text-base-content/70">Trainer management interface coming soon...</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
                <ProductForm 
                    onClose={() => setShowProductForm(false)} 
                    categories={categories}
                />
            )}
        </motion.div>
    );
};

export default AdminDashboard;