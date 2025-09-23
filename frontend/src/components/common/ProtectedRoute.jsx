import React from 'react';
import { Navigate } from 'react-router-dom';
import { userStore } from '../../storeData/userStore';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user } = userStore();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="alert alert-error max-w-md">
                    <span>Access denied. You don't have permission to view this page.</span>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;