import React from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, Trash2, UserPlus } from 'lucide-react';
import { adminStore } from '../../../storeData/adminStore';

const UsersTab = ({ onDeleteUser, onPromoteUser }) => {
    const { 
        users, 
        isLoading: isLoadingAdmin, 
        fetchAllUsers,
        deleteUser,
        changeUserStatus
    } = adminStore();

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const handleDeleteUser = onDeleteUser || (async (userId, username) => {
        if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
            await deleteUser(userId);
        }
    });

    const handlePromoteUser = onPromoteUser || (async (userId, username) => {
        if (window.confirm(`Promote "${username}" to trainer role?`)) {
            await changeUserStatus(userId);
        }
    });

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin': return 'badge-error';
            case 'trainer': return 'badge-warning';
            case 'customer': return 'badge-info';
            default: return 'badge-ghost';
        }
    };

    return (
        <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
            <div className="card-body p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <h2 className="card-title text-lg sm:text-xl">User Management</h2>
                    <button 
                        className="btn btn-outline btn-sm w-full sm:w-auto"
                        onClick={fetchAllUsers}
                        disabled={isLoadingAdmin}
                    >
                        Refresh
                    </button>
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
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
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
                                                                src={userData.profileImage || `https://placehold.co/48x48?text=${userData.username?.charAt(0) || 'U'}`} 
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

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {users.map(userData => (
                                <div key={userData._id} className="card bg-base-200 shadow">
                                    <div className="card-body p-4">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img 
                                                        src={userData.profileImage || `https://placehold.co/48x48?text=${userData.username?.charAt(0) || 'U'}`} 
                                                        alt={userData.username} 
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-base truncate">{userData.username}</div>
                                                <div className="text-sm opacity-70 truncate">{userData.email}</div>
                                                <div className="text-xs opacity-50 mt-1">
                                                    ID: {userData._id.slice(-6)}
                                                </div>
                                            </div>
                                            <div className={`badge ${getRoleBadgeClass(userData.role)} badge-sm`}>
                                                {userData.role}
                                            </div>
                                        </div>
                                        
                                        <div className="text-xs opacity-70 mb-3">
                                            Joined: {new Date(userData.createdAt).toLocaleDateString()}
                                        </div>
                                        
                                        {/* these are for the buttons in the cards for mobile */}
                                        <div className="grid grid-cols-3 gap-2">
                                            {/* these for the button to when a customer is promoted to a trainer */}
                                            {userData.role === 'customer' && (
                                                <button 
                                                    className="btn btn-sm btn-warning min-w-[100px]"
                                                    onClick={() => handlePromoteUser(userData._id, userData.username)}
                                                >
                                                    <div className="flex items-center justify-center text-center">
                                                        <UserPlus className="w-4 h-4 mr-1" />
                                                        <span className="hidden sm:inline ml-1">Promote</span>
                                                    </div>
                                                </button>
                                            )}
                                            {/* View button */}
                                            <button 
                                                className="btn btn-sm btn-ghost min-w-[100px]"
                                            >
                                                <div className="flex items-center justify-center text-center">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    <span className="hidden sm:inline ml-1">View</span>
                                                </div>
                                            </button>
                                            {/* Admin button */}
                                            {userData.role !== 'admin' && (
                                                <button 
                                                    className="btn btn-sm btn-error min-w-[100px]"
                                                    onClick={() => handleDeleteUser(userData._id, userData.username)}
                                                >
                                                    <div className="flex items-center justify-center text-center">
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        <span className="hidden sm:inline ml-1">Delete</span>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export { UsersTab };