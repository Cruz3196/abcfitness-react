import React from 'react';
import { motion } from 'framer-motion';
import { 
    Dumbbell, 
    Calendar, 
    Tag, 
    Clock, 
    Users, 
    DollarSign 
} from 'lucide-react';
import { adminStore } from '../../../storeData/adminStore';

const ClassesTab = () => {
    // Get admin store data
    const { 
        viewClasses,
        isLoading: isLoadingAdmin, 
        fetchClassInsights
    } = adminStore();

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
            <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title">All Classes</h2>
                    <div className="flex gap-2">
                        <button 
                            className="btn btn-outline btn-sm"
                            onClick={fetchClassInsights}
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
                                                {classItem.timeSlot?.day}, {classItem.timeSlot?.startTime} - {classItem.timeSlot?.endTime}
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
                                                {classItem.attendees?.length || 0} / {classItem.capacity} spots filled
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-success" />
                                            <span>${classItem.price?.toFixed(2) || '0.00'}</span>
                                        </div>
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

export { ClassesTab };