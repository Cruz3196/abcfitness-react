import React from 'react';
import { userStore } from '../storeData/userStore';
import AdminDashboard from './AdminDashboard';
import TrainerDashboard from './TrainerDashboard';
import  CustomerProfile from '../components/user/CustomerProfile';

const ProfilePage = () => {
    const { user, isAdmin, isTrainer } = userStore();
    
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="alert alert-warning">
                    <span>Please log in to view your profile.</span>
                </div>
            </div>
        );
    }

    // Render different content based on user role
    if (isAdmin()) {
        return <AdminDashboard />;
    }
    
    if (isTrainer()) {
        return <TrainerDashboard />;
    }
    
    // Default to customer profile
    return <CustomerProfile />;
};

export default ProfilePage;