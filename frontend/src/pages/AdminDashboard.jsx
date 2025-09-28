import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Package, 
    DollarSign, 
    TrendingUp, 
    Settings,
    UserCheck,
    ShoppingBag,
    FileText,
    Eye,
    Trash2,
    UserPlus,
    Dumbbell,
    Calendar,
    Star,
    MapPin,
    StarOff,
    Edit,
    Tag,
    Clock,
} from 'lucide-react';
import { userStore } from '../storeData/userStore';
import { productStore } from '../storeData/productStore';
import { adminStore } from '../storeData/adminStore';
import ProductForm from '../components/admin/ProductForm';
import ProductEditForm from '../components/admin/ProductEditForm';


const AdminDashboard = () => {
    const { user, isAdmin } = userStore();
    const { viewClasses } = adminStore();
    const [activeTab, setActiveTab] = useState('overview');
    const [showProductForm, setShowProductForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // from the product store
    const { 
        products, 
        categories, 
        isLoading: isLoadingProducts, 
        fetchAllProducts,
        deleteProduct,
        toggleFeaturedProduct
    } = productStore();

    // deleting a product
    const handleDeleteProduct = async (productId, productName) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            await deleteProduct(productId);
        }
    };

    // Handle edit product
    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowEditForm(true);
    };

    // Handle toggle featured
    const handleToggleFeatured = async (productId, currentStatus) => {
        await toggleFeaturedProduct(productId);
    };

    
    // for the admin store 
    const { 
        users, 
        trainers,
        dashboardStats, 
        pendingTrainers,
        isLoading: isLoadingAdmin, 
        fetchAllUsers, 
        fetchDashboardStats,
        fetchPendingTrainers,
        fetchClassInsights,
        deleteUser,
        changeUserStatus,
        fetchAllTrainers
    } = adminStore();

    // Fetch data based on active tab
    useEffect(() => {
        switch (activeTab) {
            case 'overview':
                fetchDashboardStats();
                fetchPendingTrainers();
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
    }, [activeTab, fetchAllUsers, fetchDashboardStats, fetchPendingTrainers, fetchAllProducts, fetchAllTrainers, fetchClassInsights]);


    // Handle user deletion with confirmation
    const handleDeleteUser = async (userId, username) => {
        if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
            await deleteUser(userId);
        }
    };

    // Handle promote user to trainer
    const handlePromoteUser = async (userId, username) => {
        if (window.confirm(`Promote "${username}" to trainer role?`)) {
            await changeUserStatus(userId);
        }
    };

    // Get user role badge color
    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin': return 'badge-error';
            case 'trainer': return 'badge-warning';
            case 'customer': return 'badge-info';
            default: return 'badge-ghost';
        }
    };


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
                    <button 
                        className={`tab ${activeTab === 'classes' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('classes')}
                    >
                        Classes
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
                        </div>

                        {/* Pending Trainer Approvals */}
                        <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                            <div className="card-body">
                                <h2 className="card-title">Pending Trainer Profiles</h2>
                                {isLoadingAdmin ? (
                                    <div className="flex justify-center py-4">
                                        <span className="loading loading-spinner loading-md"></span>
                                    </div>
                                ) : pendingTrainers.length === 0 ? (
                                    <p className="text-base-content/70">No pending trainer profiles</p>
                                ) : (
                                    <div className="space-y-3">
                                        {pendingTrainers.map(trainer => (
                                            <div key={trainer._id} className="flex items-center justify-between p-3 border border-base-300 rounded-lg">
                                                <div>
                                                        <h3 className="font-bold text-lg">
                                                            {trainer.username || 'Unknown Trainer'}
                                                        </h3>
                                                        <p className="text-sm text-base-content/70">
                                                            {trainer.email}
                                                        </p>
                                                    <p className="text-xs text-base-content/50">
                                                        Joined: {new Date(trainer.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="badge badge-warning">Needs Profile Setup</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="card-title">User Management</h2>
                                <div className="flex gap-2">
                                    <button 
                                        className="btn btn-outline btn-sm"
                                        onClick={fetchAllUsers}
                                        disabled={isLoadingAdmin}
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>
                            
                            {isLoadingAdmin ? (
                                <div className="flex justify-center py-8">
                                    <span className="loading loading-spinner loading-lg"></span>
                                </div>
                            ) : users.length === 0 ? (
                                <div className="text-center py-8">
                                    <Users className="mx-auto w-16 h-16 text-base-300 mb-2" />
                                    <p className="text-base-content/70">No users found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Joined</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(userData => (
                                                <tr key={userData._id}>
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            <div className="avatar">
                                                                <div className="mask mask-squircle w-12 h-12">
                                                                    <img 
                                                                        src={userData.profileImage || "https://placehold.co/48x48?text=" + userData.username.charAt(0)} 
                                                                        alt={userData.username} 
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="font-bold">{userData.username}</div>
                                                                <div className="text-sm opacity-50">
                                                                    ID: {userData._id.slice(-6)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{userData.email}</td>
                                                    <td>
                                                        <div className={`badge ${getRoleBadgeClass(userData.role)}`}>
                                                            {userData.role}
                                                        </div>
                                                    </td>
                                                    <td>{new Date(userData.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <div className="flex gap-2">
                                                            {userData.role === 'customer' && (
                                                                <button 
                                                                    className="btn btn-sm btn-warning"
                                                                    onClick={() => handlePromoteUser(userData._id, userData.username)}
                                                                    title="Promote to Trainer"
                                                                >
                                                                    <UserPlus className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <button 
                                                                className="btn btn-sm btn-ghost"
                                                                title="View Details"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            {userData.role !== 'admin' && (
                                                                <button 
                                                                    className="btn btn-sm btn-error"
                                                                    onClick={() => handleDeleteUser(userData._id, userData.username)}
                                                                    title="Delete User"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
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

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="card-title">Product Management</h2>
                                <div className="flex gap-2">
                                    <button 
                                        className="btn btn-outline btn-sm"
                                        onClick={fetchAllProducts}
                                        disabled={isLoadingProducts}
                                    >
                                        Refresh
                                    </button>
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => setShowProductForm(true)}
                                    >
                                        Add Product
                                    </button>
                                </div>
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
                                                        <button
                                                            className={`btn btn-sm ${product.isFeatured ? 'btn-warning' : 'btn-ghost'}`}
                                                            onClick={() => handleToggleFeatured(product._id, product.isFeatured)}
                                                            title={product.isFeatured ? 'Remove from featured' : 'Add to featured'}
                                                        >
                                                            {product.isFeatured ? (
                                                                <>
                                                                    <Star className="w-4 h-4 mr-1" />
                                                                    Featured
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <StarOff className="w-4 h-4 mr-1" />
                                                                    Not Featured
                                                                </>
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <div className="flex gap-2">
                                                            <button 
                                                                className="btn btn-sm btn-ghost"
                                                                onClick={() => handleEditProduct(product)}
                                                                title="Edit Product"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-ghost"
                                                                title="View Details"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-error"
                                                                onClick={() => handleDeleteProduct(product._id, product.productName)}
                                                                title="Delete Product"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
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
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="card-title">Trainer Management</h2>
                                    <div className="flex gap-2">
                                        <button 
                                            className="btn btn-outline btn-sm"
                                            onClick={fetchAllTrainers}
                                            disabled={isLoadingAdmin}
                                        >
                                            Refresh
                                        </button>
                                    </div>
                                </div>
                                
                                {isLoadingAdmin ? (
                                    <div className="flex justify-center py-8">
                                        <span className="loading loading-spinner loading-lg"></span>
                                    </div>
                                ) : trainers.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Dumbbell className="mx-auto w-16 h-16 text-base-300 mb-2" />
                                        <p className="text-base-content/70 mb-4">No trainers found</p>
                                        <p className="text-sm text-base-content/50">
                                            Promote users to trainers from the Users tab
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {trainers.map(trainer => (
                                            <motion.div 
                                                key={trainer._id} 
                                                className="card bg-base-200 shadow-md"
                                                variants={itemVariants}
                                            >
                                                <div className="card-body">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="avatar">
                                                            <div className="w-12 h-12 rounded-full">
                                                                <img 
                                                                    src={trainer.profileImage || `https://placehold.co/48x48?text=${trainer.username?.charAt(0) || 'T'}`} 
                                                                    alt={trainer.username || 'Trainer'} 
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-lg">
                                                                {trainer.username || 'Unknown Trainer'}
                                                            </h3>
                                                            <p className="text-sm text-base-content/70">
                                                                {trainer.email || 'No email'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <Dumbbell className="w-4 h-4 text-primary" />
                                                            <span className="text-sm">
                                                                {trainer.specialization || 'No specialization set'}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-2">
                                                            <Star className="w-4 h-4 text-warning" />
                                                            <span className="text-sm">
                                                                {trainer.experience ? `${trainer.experience} years experience` : 'Experience not set'}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-accent" />
                                                            <span className="text-sm">
                                                                {trainer.location || 'Location not set'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {trainer.goals && (
                                                        <div className="mb-4">
                                                            <p className="text-xs text-base-content/70 line-clamp-3">
                                                                {trainer.goals}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="badge badge-success">
                                                            Role: {trainer.role}
                                                        </div>
                                                        <div className="text-xs text-base-content/50">
                                                            Joined: {new Date(trainer.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>

                                                    <div className="card-actions justify-end">
                                                        <button className="btn btn-sm btn-ghost">
                                                            <Eye className="w-4 h-4" />
                                                            View Details
                                                        </button>
                                                        <button className="btn btn-sm btn-primary">
                                                            <Settings className="w-4 h-4" />
                                                            Manage
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                {/* Classes Tab */}
                {activeTab === 'classes' && (
                    <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="card-title">All Classes</h2>
                                <div className="flex gap-2">
                                    <button 
                                        className="btn btn-outline btn-sm"
                                        onClick={fetchClassInsights} // Use the renamed fetch function here too
                                        disabled={isLoadingAdmin}
                                    >
                                        {isLoadingAdmin ? 'Refreshing...' : 'Refresh'}
                                    </button>
                                </div>
                            </div>
                            
                            {isLoadingAdmin && viewClasses.length === 0 ? (
                                <div className="flex justify-center py-8">
                                    <span className="loading loading-spinner loading-lg"></span>
                                </div>
                            ) : viewClasses.length === 0 ? (
                                <div className="text-center py-8">
                                    <Dumbbell className="mx-auto w-16 h-16 text-base-300 mb-2" />
                                    <p className="text-base-content/70 mb-4">No classes have been created yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {viewClasses.map(classItem => (
                                        <motion.div 
                                            key={classItem._id} 
                                            className="card bg-base-200 shadow-md"
                                            variants={itemVariants}
                                        >
                                            <figure>
                                                <img 
                                                    src={classItem.classPic || `https://placehold.co/400x225?text=${classItem.classTitle || 'Class'}`} 
                                                    alt={classItem.classTitle || 'Class Image'} 
                                                    className="h-48 w-full object-cover"
                                                />
                                            </figure>
                                            <div className="card-body p-5">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="card-title text-lg font-bold">
                                                        {classItem.classTitle || 'Unnamed Class'}
                                                    </h3>
                                                    <div className={`badge ${
                                                        classItem.status === 'available' ? 'badge-success' : 
                                                        classItem.status === 'completed' ? 'badge-neutral' : 'badge-error'
                                                    } badge-outline capitalize`}>
                                                        {classItem.status}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-base-content/70 mb-4 line-clamp-2">
                                                    {classItem.classDescription || 'No description available.'}
                                                </p>

                                                <div className="space-y-3 text-sm mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-accent" />
                                                        <span>
                                                            {classItem.timeSlot.day}, {classItem.timeSlot.startTime} - {classItem.timeSlot.endTime}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="w-4 h-4 text-info" />
                                                        <span>Type: {classItem.classType}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-warning" />
                                                        <span>{classItem.duration} minutes</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-primary" />
                                                        <span>
                                                            {classItem.attendees.length} / {classItem.capacity} spots filled
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4 text-success" />
                                                        <span>${classItem.price.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
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

            {/* Product Edit Modal */}
            {showEditForm && editingProduct && (
                <ProductEditForm 
                    product={editingProduct}
                    onClose={() => {
                        setShowEditForm(false);
                        setEditingProduct(null);
                    }} 
                    categories={categories}
                />
            )}
        </motion.div>
    );
};

export default AdminDashboard;