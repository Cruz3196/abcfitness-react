import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Star, MapPin, Eye, Settings } from 'lucide-react';
import { adminStore } from '../../../storeData/adminStore';

const TrainersTab = () => {
    // Get admin store data
    const { 
        trainers,
        isLoading: isLoadingAdmin, 
        fetchAllTrainers
    } = adminStore();

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
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
    );
};

export { TrainersTab };