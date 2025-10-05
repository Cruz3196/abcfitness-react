import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, DollarSign, Package } from 'lucide-react';
import { userStore } from '../storeData/userStore';
import { adminStore } from '../storeData/adminStore';
import { productStore } from '../storeData/productStore';

// Your existing imports - FIX THIS LINE
import { ProductRow } from '../components/admin/adminUI/ProductRow';
import { UserRow } from '../components/admin/adminUI/UserRow';
import { TabNavigation } from '../components/admin/adminUI/TabNavigation';
import { RevenueChart } from '../components/admin/charts/RevenueChart';
import { MonthlyTrendsChart } from '../components/admin/charts/MonthlyTrendsChart';
import { ProductCategoriesChart } from '../components/admin/charts/ProductCategoriesChart';
import { ClassesTab } from '../components/admin/tabs/ClassesTab';
import { ProductsTab } from '../components/admin/tabs/ProductsTab';
import { TrainersTab } from '../components/admin/tabs/TrainersTab';
import { UsersTab } from '../components/admin/tabs/UsersTab'; // Changed from UserTab to UsersTab

// Additional imports that might be needed
import ProductForm from '../components/admin/ProductForm';
import ProductEditForm from '../components/admin/ProductEditForm';

const AdminDashboard = () => {
    const { user, isAdmin } = userStore();
    const [activeTab, setActiveTab] = useState('overview');
    const [showProductForm, setShowProductForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Get store data
    const { 
        dashboardStats,
        users,
        trainers,
        viewClasses,
        isLoading: isLoadingAdmin,
        fetchDashboardStats,
        fetchAllUsers, 
        fetchAllTrainers,
        fetchClassInsights,
        deleteUser,
        changeUserStatus
    } = adminStore();

    const { 
        products, 
        categories, 
        isLoading: isLoadingProducts,
        fetchAllProducts,
        deleteProduct,
        toggleFeaturedProduct
    } = productStore();

    // Fetch data based on active tab
    useEffect(() => {
        if (!isAdmin()) return;

        switch (activeTab) {
            case 'overview':
                fetchDashboardStats();
                fetchAllProducts();
                break;
            case 'users':
                fetchAllUsers();
                break;
            case 'products':
                fetchAllProducts();
                break;
            case 'trainers':
                fetchAllTrainers();
                break;
            case 'classes':
                fetchClassInsights();
                break;
            default:
                break;
        }
    }, [activeTab, fetchDashboardStats, fetchAllUsers, fetchAllProducts, fetchAllTrainers, fetchClassInsights, isAdmin]);

    // Handler functions
    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowEditForm(true);
    };

    const handleDeleteProduct = async (productId, productName) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            await deleteProduct(productId);
        }
    };

    const handleToggleFeatured = async (productId, currentStatus) => {
        await toggleFeaturedProduct(productId);
    };

    const handleDeleteUser = async (userId, username) => {
        if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
            await deleteUser(userId);
        }
    };

    const handlePromoteUser = async (userId, username) => {
        if (window.confirm(`Promote "${username}" to trainer role?`)) {
            await changeUserStatus(userId);
        }
    };

    // Check admin access
    if (!isAdmin()) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="alert alert-error max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
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
                <motion.div className="text-center mb-8" variants={itemVariants}>
                    <h1 className="text-4xl font-bold text-base-content mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-base-content/70">
                        Manage your fitness business from one place
                    </p>
                </motion.div>

                {/* Tab Navigation */}
                <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Tab Content */}
                <div className="mb-8">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div variants={containerVariants}>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <motion.div className="stat bg-base-100 shadow-lg rounded-lg" variants={itemVariants}>
                                    <div className="stat-figure text-primary">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <div className="stat-title">Total Users</div>
                                    <div className="stat-value text-primary">
                                        {dashboardStats?.users?.totalUsers || 0}
                                    </div>
                                    <div className="stat-desc">
                                        {dashboardStats?.users?.newUsersThisMonth || 0} new this month
                                    </div>
                                </motion.div>

                                <motion.div className="stat bg-base-100 shadow-lg rounded-lg" variants={itemVariants}>
                                    <div className="stat-figure text-secondary">
                                        <UserCheck className="w-8 h-8" />
                                    </div>
                                    <div className="stat-title">Trainers</div>
                                    <div className="stat-value text-secondary">
                                        {dashboardStats?.users?.totalTrainers || 0}
                                    </div>
                                    <div className="stat-desc">Active trainers</div>
                                </motion.div>

                                <motion.div className="stat bg-base-100 shadow-lg rounded-lg" variants={itemVariants}>
                                    <div className="stat-figure text-accent">
                                        <DollarSign className="w-8 h-8" />
                                    </div>
                                    <div className="stat-title">Total Revenue</div>
                                    <div className="stat-value text-accent">
                                        ${((dashboardStats?.financials?.totalProductRevenue || 0) + 
                                            (dashboardStats?.financials?.totalClassRevenue || 0)).toLocaleString()}
                                    </div>
                                    <div className="stat-desc">Products + Classes</div>
                                </motion.div>

                                <motion.div className="stat bg-base-100 shadow-lg rounded-lg" variants={itemVariants}>
                                    <div className="stat-figure text-info">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <div className="stat-title">Products</div>
                                    <div className="stat-value text-info">
                                        {products?.length || 0}
                                    </div>
                                    <div className="stat-desc">Total products</div>
                                </motion.div>
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <RevenueChart dashboardStats={dashboardStats} />
                                <ProductCategoriesChart products={products} categories={categories} />
                            </div>

                            {/* Monthly Trends Chart */}
                            <MonthlyTrendsChart />
                        </motion.div>
                    )}
                    
                    {/* Users Tab - CHANGED FROM UserTab TO UsersTab */}
                    {activeTab === 'users' && (
                        <UsersTab
                            onDeleteUser={handleDeleteUser}
                            onPromoteUser={handlePromoteUser}
                        />
                    )}
                    
                    {/* Products Tab */}
                    {activeTab === 'products' && (
                        <ProductsTab 
                            setShowProductForm={setShowProductForm}
                            handleEditProduct={handleEditProduct}
                            handleDeleteProduct={handleDeleteProduct}
                            handleToggleFeatured={handleToggleFeatured}
                        />
                    )}
                    
                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                            <div className="card-body">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="card-title">Order Management</h2>
                                    <button className="btn btn-outline btn-sm">
                                        Refresh
                                    </button>
                                </div>
                                <div className="text-center py-8">
                                    <Package className="mx-auto w-16 h-16 text-base-300 mb-2" />
                                    <p className="text-base-content/70 mb-4">No orders found</p>
                                    <p className="text-sm text-base-content/50">
                                        Orders will appear here when customers make purchases
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    
                    {/* Trainers Tab */}
                    {activeTab === 'trainers' && <TrainersTab />}
                    
                    {/* Classes Tab */}
                    {activeTab === 'classes' && <ClassesTab />}
                </div>
            </div>

            {/* Modals */}
            {showProductForm && (
                <ProductForm 
                    isOpen={showProductForm}
                    onClose={() => setShowProductForm(false)}
                />
            )}

            {showEditForm && editingProduct && (
                <ProductEditForm 
                    isOpen={showEditForm}
                    product={editingProduct}
                    categories={categories}
                    onClose={() => {
                        setShowEditForm(false);
                        setEditingProduct(null);
                    }}
                />
            )}
        </motion.div>
    );
};

export default AdminDashboard;