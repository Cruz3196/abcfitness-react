import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { userStore } from '../storeData/userStore';

import TrainerProfileTab from '../components/trainer/TrainerProfileTab';
import TrainerClassesTab from '../components/trainer/TrainerClassesTab';
import EditProfileModal from '../components/trainer/EditProfileModal';
import CreateClassModal from '../components/trainer/CreateClassModal';

const TrainerDashboard = () => {
    const { user, fetchMyClasses } = userStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [showCreateClass, setShowCreateClass] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (user?.isTrainer) {
            fetchMyClasses();
        }
    }, [user?.isTrainer, fetchMyClasses]);

    if (!user || !user.trainerProfile) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
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
                    <h1 className="text-4xl font-bold text-base-content mb-2">Trainer Dashboard</h1>
                    <p className="text-base-content/70">Welcome back, {user.username}</p>
                </motion.div>

                {/* Tabs */}
                <motion.div className="tabs tabs-boxed mb-8" variants={itemVariants}>
                    <button 
                        className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`} 
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                    <button 
                        className={`tab ${activeTab === 'classes' ? 'tab-active' : ''}`} 
                        onClick={() => setActiveTab('classes')}
                    >
                        My Classes
                    </button>
                </motion.div>

                {/* Tab Content */}
                {activeTab === 'classes' && (
                    <TrainerClassesTab 
                        user={user}
                        onCreateClass={() => setShowCreateClass(true)}
                        itemVariants={itemVariants}
                    />
                )}

                {activeTab === 'profile' && (
                    <TrainerProfileTab 
                        user={user}
                        onEditProfile={() => setIsEditModalOpen(true)}
                        itemVariants={itemVariants}
                    />
                )}
            </div>

            {/* Modals */}
            <EditProfileModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
            />

            <CreateClassModal 
                isOpen={showCreateClass}
                onClose={() => setShowCreateClass(false)}
            />
        </motion.div>
    );
};

export default TrainerDashboard;