import React from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, Trash2, UserPlus } from 'lucide-react';
import { adminStore } from '../../../storeData/adminStore';

const UsersTab = ({ onDeleteUser, onPromoteUser }) => { // Accept props
    // for the admin store 
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

    // Use props or fallback to local handlers
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

    // Get user role badge color
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
                )}
            </div>
        </motion.div>
    );
};

export { UsersTab };