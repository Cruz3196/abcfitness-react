import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Calendar, 
    Users, 
    Plus, 
    Edit, 
    Trash2, 
    Eye,
    Clock,
    MapPin,
    DollarSign
} from 'lucide-react';
import { userStore } from '../storeData/userStore';

const TrainerDashboard = () => {
    const { user, isTrainer } = userStore();
    const [activeTab, setActiveTab] = useState('overview');
    const [showCreateClass, setShowCreateClass] = useState(false);

    // Mock data for trainer dashboard
    const trainerStats = {
        totalClasses: 12,
        totalStudents: 89,
        upcomingClasses: 5,
        monthlyEarnings: 3200
    };

    const mockClasses = [
        {
            _id: '1',
            title: 'Morning Yoga Flow',
            description: 'Start your day with energizing yoga poses',
            date: '2024-01-20',
            time: '07:00',
            duration: 60,
            maxCapacity: 20,
            currentAttendees: 15,
            price: 25,
            location: 'Studio A'
        },
        {
            _id: '2',
            title: 'HIIT Cardio Blast',
            description: 'High-intensity interval training session',
            date: '2024-01-22',
            time: '18:00',
            duration: 45,
            maxCapacity: 15,
            currentAttendees: 12,
            price: 30,
            location: 'Studio B'
        }
    ];

    if (!isTrainer()) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="alert alert-error">
                    <span>Access denied. Trainer privileges required.</span>
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
                    <h1 className="text-4xl font-bold text-base-content mb-2">Trainer Dashboard</h1>
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
                        className={`tab ${activeTab === 'classes' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('classes')}
                    >
                        My Classes
                    </button>
                    <button 
                        className={`tab ${activeTab === 'schedule' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('schedule')}
                    >
                        Schedule
                    </button>
                    <button 
                        className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                </motion.div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <motion.div variants={containerVariants}>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <motion.div className="stat bg-base-100 shadow-lg rounded-lg" variants={itemVariants}>
                                <div className="stat-figure text-primary">
                                    <Calendar className="w-8 h-8" />
                                </div>
                                <div className="stat-title">Total Classes</div>
                                <div className="stat-value text-primary">{trainerStats.totalClasses}</div>
                            </motion.div>

                            <motion.div className="stat bg-base-100 shadow-lg rounded-lg" variants={itemVariants}>
                                <div className="stat-figure text-secondary">
                                    <Users className="w-8 h-8" />
                                </div>
                                <div className="stat-title">Students</div>
                                <div className="stat-value text-secondary">{trainerStats.totalStudents}</div>
                            </motion.div>

                            <motion.div className="stat bg-base-100 shadow-lg rounded-lg" variants={itemVariants}>
                                <div className="stat-figure text-accent">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <div className="stat-title">Upcoming</div>
                                <div className="stat-value text-accent">{trainerStats.upcomingClasses}</div>
                            </motion.div>

                            <motion.div className="stat bg-base-100 shadow-lg rounded-lg" variants={itemVariants}>
                                <div className="stat-figure text-success">
                                    <DollarSign className="w-8 h-8" />
                                </div>
                                <div className="stat-title">Monthly Earnings</div>
                                <div className="stat-value text-success">${trainerStats.monthlyEarnings}</div>
                            </motion.div>
                        </div>

                        {/* Quick Actions */}
                        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={itemVariants}>
                            <div className="card bg-base-100 shadow-lg">
                                <div className="card-body">
                                    <h2 className="card-title">Quick Actions</h2>
                                    <div className="flex flex-wrap gap-3">
                                        <button 
                                            className="btn btn-primary gap-2"
                                            onClick={() => setShowCreateClass(true)}
                                        >
                                            <Plus className="w-4 h-4" />
                                            Create Class
                                        </button>
                                        <button className="btn btn-outline gap-2">
                                            <Calendar className="w-4 h-4" />
                                            View Schedule
                                        </button>
                                        <button className="btn btn-outline gap-2">
                                            <Users className="w-4 h-4" />
                                            View Students
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="card bg-base-100 shadow-lg">
                                <div className="card-body">
                                    <h2 className="card-title">Upcoming Classes</h2>
                                    <div className="space-y-3">
                                        {mockClasses.slice(0, 3).map(classItem => (
                                            <div key={classItem._id} className="flex items-center justify-between p-3 border border-base-300 rounded-lg">
                                                <div>
                                                    <h3 className="font-semibold">{classItem.title}</h3>
                                                    <p className="text-sm text-base-content/70">
                                                        {classItem.date} at {classItem.time}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium">
                                                        {classItem.currentAttendees}/{classItem.maxCapacity}
                                                    </p>
                                                    <p className="text-xs text-base-content/70">attendees</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Classes Tab */}
                {activeTab === 'classes' && (
                    <motion.div variants={itemVariants}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">My Classes</h2>
                            <button 
                                className="btn btn-primary gap-2"
                                onClick={() => setShowCreateClass(true)}
                            >
                                <Plus className="w-4 h-4" />
                                Create New Class
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mockClasses.map(classItem => (
                                <motion.div 
                                    key={classItem._id}
                                    className="card bg-base-100 shadow-lg"
                                    variants={itemVariants}
                                >
                                    <div className="card-body">
                                        <h3 className="card-title">{classItem.title}</h3>
                                        <p className="text-base-content/70 mb-4">{classItem.description}</p>
                                        
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{classItem.date} at {classItem.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{classItem.duration} minutes</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>{classItem.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                <span>{classItem.currentAttendees}/{classItem.maxCapacity} attendees</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4" />
                                                <span>${classItem.price}</span>
                                            </div>
                                        </div>

                                        <div className="card-actions justify-end mt-4">
                                            <button className="btn btn-sm btn-ghost">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="btn btn-sm btn-ghost">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="btn btn-sm btn-ghost text-error">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                    <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                        <div className="card-body">
                            <h2 className="card-title mb-4">My Schedule</h2>
                            <p className="text-base-content/70">Schedule management interface coming soon...</p>
                        </div>
                    </motion.div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                        <div className="card-body">
                            <h2 className="card-title mb-4">Trainer Profile</h2>
                            <p className="text-base-content/70">Profile management interface coming soon...</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Create Class Modal */}
            {showCreateClass && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">Create New Class</h3>
                        
                        <form className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Class Title</span>
                                </label>
                                <input type="text" className="input input-bordered w-full" />
                            </div>
                            
                            <div>
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea className="textarea textarea-bordered w-full" rows="3"></textarea>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text">Date</span>
                                    </label>
                                    <input type="date" className="input input-bordered w-full" />
                                </div>
                                
                                <div>
                                    <label className="label">
                                        <span className="label-text">Time</span>
                                    </label>
                                    <input type="time" className="input input-bordered w-full" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text">Duration (minutes)</span>
                                    </label>
                                    <input type="number" className="input input-bordered w-full" />
                                </div>
                                
                                <div>
                                    <label className="label">
                                        <span className="label-text">Max Capacity</span>
                                    </label>
                                    <input type="number" className="input input-bordered w-full" />
                                </div>
                                
                                <div>
                                    <label className="label">
                                        <span className="label-text">Price ($)</span>
                                    </label>
                                    <input type="number" step="0.01" className="input input-bordered w-full" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="label">
                                    <span className="label-text">Location</span>
                                </label>
                                <input type="text" className="input input-bordered w-full" />
                            </div>
                        </form>
                        
                        <div className="modal-action">
                            <button 
                                className="btn"
                                onClick={() => setShowCreateClass(false)}
                            >
                                Cancel
                            </button>
                            <button className="btn btn-primary">Create Class</button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default TrainerDashboard;