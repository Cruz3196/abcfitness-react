import React, { useState } from 'react';
import { Eye, Trash2, UserPlus, Shield, ShieldCheck } from 'lucide-react';

const UserRow = ({ 
    user, 
    onDelete, 
    onPromote, 
    onViewDetails 
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin': return 'badge-error';
            case 'trainer': return 'badge-warning';
            case 'customer': return 'badge-info';
            default: return 'badge-ghost';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <ShieldCheck className="w-3 h-3" />;
            case 'trainer': return <Shield className="w-3 h-3" />;
            default: return null;
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await onDelete(user._id, user.username);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePromote = async () => {
        setIsLoading(true);
        try {
            await onPromote(user._id, user.username);
        } finally {
            setIsLoading(false);
        }
    };

    const formatJoinDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <tr className="hover:bg-base-200 transition-colors duration-200">
            <td>
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                            <img 
                                src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=random`} 
                                alt={user.username || 'User'} 
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="font-bold text-base-content">
                            {user.username || 'Unknown User'}
                        </div>
                        <div className="text-sm opacity-50 text-base-content/70">
                            ID: {user._id?.slice(-8) || 'N/A'}
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div className="text-base-content">
                    {user.email || 'No email provided'}
                </div>
            </td>
            <td>
                <div className={`badge ${getRoleBadgeClass(user.role)} gap-1`}>
                    {getRoleIcon(user.role)}
                    {user.role || 'customer'}
                </div>
            </td>
            <td>
                <div className="text-base-content">
                    {formatJoinDate(user.createdAt)}
                </div>
            </td>
            <td>
                <div className="flex gap-1">
                    <div className="tooltip" data-tip="View Details">
                        <button 
                            className="btn btn-sm btn-ghost hover:btn-info"
                            onClick={() => onViewDetails?.(user)}
                            disabled={isLoading}
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>

                    {user.role === 'customer' && (
                        <div className="tooltip" data-tip="Promote to Trainer">
                            <button 
                                className="btn btn-sm btn-ghost hover:btn-warning"
                                onClick={handlePromote}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <UserPlus className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    )}

                    {user.role !== 'admin' && (
                        <div className="tooltip" data-tip="Delete User">
                            <button 
                                className="btn btn-sm btn-ghost hover:btn-error"
                                onClick={handleDelete}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};

export { UserRow };