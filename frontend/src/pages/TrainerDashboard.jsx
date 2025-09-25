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
    DollarSign,
    Award,
    Info,
    X
} from 'lucide-react';
import { userStore } from '../storeData/userStore';

const TrainerDashboard = () => {
    // ✅ CHANGE: We now get the complete user object, which includes the trainer profile and classes.
    const { user, updateTrainerProfile } = userStore();
    const [activeTab, setActiveTab] = useState('profile');

    // ✅ ADDED: State management for the modals and form data
    const [showCreateClass, setShowCreateClass] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // ✅ ADDED: Handler to open the modal and pre-fill it with current data
    const handleOpenEditModal = () => {
        setEditFormData({
            specialization: user.trainerProfile.specialization || '',
            bio: user.trainerProfile.bio || '',
            certifications: user.trainerProfile.certifications || '',
            experience: user.trainerProfile.experience || 0,
            trainerProfilePic: user.trainerProfile.trainerProfilePic || ''
        });
        setIsEditModalOpen(true);
    };

    // ✅ ADDED: State and handlers for editing the trainer profile
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditFormData(prev => ({ ...prev, trainerProfilePic: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // ✅ ADDED: Handler for submitting the updated profile
    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await updateTrainerProfile(editFormData);
        setIsSubmitting(false);
        if (success) {
            setIsEditModalOpen(false);
        }
    };

    // ✅ CHANGE: This is a more robust guard clause. It ensures the user is logged in,
    // is a trainer, and has completed the profile setup before rendering the dashboard.
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

    // TODO: Replace with real data calculations once available from the backend.
    const trainerStats = {
        totalClasses: user.classes?.length || 0,
        totalStudents: 89, // This would need to be calculated
        upcomingClasses: user.classes?.filter(c => new Date(c.startTime) > new Date()).length || 0,
        monthlyEarnings: 3200 // This would need to be calculated
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
                    <button className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
                    <button className={`tab ${activeTab === 'classes' ? 'tab-active' : ''}`} onClick={() => setActiveTab('classes')}>My Classes</button>
                    <button className={`tab ${activeTab === 'schedule' ? 'tab-active' : ''}`} onClick={() => setActiveTab('schedule')}>Schedule</button>
                </motion.div>

                {/* Classes Tab Content */}
                {activeTab === 'classes' && (
                    <motion.div variants={itemVariants}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">My Classes</h2>
                            <button className="btn btn-primary gap-2" onClick={() => setShowCreateClass(true)}>
                                <Plus className="w-4 h-4" /> Create New Class
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {user.classes && user.classes.length > 0 ? (
                                user.classes.map(classItem => (
                                    <motion.div key={classItem._id} className="card bg-base-100 shadow-lg" variants={itemVariants}>
                                        <div className="card-body">
                                            <h3 className="card-title">{classItem.classTitle}</h3>
                                            {/* You would add more class details here */}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <p>You have not created any classes yet.</p>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Schedule Tab Content */}
                {activeTab === 'schedule' && (
                    <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                        <div className="card-body">
                            <h2 className="card-title mb-4">My Schedule</h2>
                            <p className="text-base-content/70">Schedule management interface coming soon...</p>
                        </div>
                    </motion.div>
                )}

                {/* Profile Tab Content */}
                {activeTab === 'profile' && (
                    <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
                        <div className="card-body">
                             <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                <div className="avatar">
                                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <img src={user?.trainerProfile?.trainerProfilePic || 'https://placehold.co/150'} alt="Trainer Profile"/>
                                    </div>
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <h2 className="card-title text-3xl mb-2">{user.username}</h2>
                                    {/* ✅ UPDATED: Consistent use of optional chaining for safety */}
                                    <p className="font-semibold text-primary text-lg">{user?.trainerProfile?.specialization}</p>
                                    <div className="mt-4 space-y-3 text-base-content/90">
                                        <div className="flex items-center gap-3"><Info className="w-5 h-5 ... shrink-0" /><p>{user?.trainerProfile?.bio || "No bio provided."}</p></div>
                                        <div className="flex items-center gap-3"><Award className="w-5 h-5 ... shrink-0" /><p>{user?.trainerProfile?.certifications || "No certifications listed."}</p></div>
                                        <div className="flex items-center gap-3"><Clock className="w-5 h-5 ... shrink-0" /><p>{user?.trainerProfile?.experience} years of experience</p></div>
                                    </div>
                                    <div className="card-actions justify-center sm:justify-end mt-6">
                                        {/* ✅ UPDATED: Edit button is now functional */}
                                        <button className="btn btn-primary gap-2" onClick={handleOpenEditModal}>
                                            <Edit className="w-4 h-4"/>
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* ✅ ADDED: Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl relative">
                        <button onClick={() => setIsEditModalOpen(false)} className="btn btn-sm btn-circle absolute right-2 top-2"><X size={20} /></button>
                        <h3 className="font-bold text-lg mb-4">Edit Your Profile</h3>
                        <form onSubmit={handleSubmitUpdate} className="space-y-4">
                            <div><label className="label"><span className="label-text">Specialization</span></label><input type="text" name="specialization" value={editFormData.specialization} onChange={handleInputChange} className="input input-bordered w-full" /></div>
                            <div><label className="label"><span className="label-text">Bio</span></label><textarea name="bio" value={editFormData.bio} onChange={handleInputChange} className="textarea textarea-bordered w-full" rows="3"></textarea></div>
                            <div><label className="label"><span className="label-text">Certifications</span></label><input type="text" name="certifications" value={editFormData.certifications} onChange={handleInputChange} className="input input-bordered w-full" /></div>
                            <div><label className="label"><span className="label-text">Years of Experience</span></label><input type="number" name="experience" value={editFormData.experience} onChange={handleInputChange} className="input input-bordered w-full" /></div>
                            <div><label className="label"><span className="label-text">Profile Picture</span></label><input type="file" accept="image/*" onChange={handleFileChange} className="file-input file-input-bordered w-full" />
                                {editFormData.trainerProfilePic && (
                                    <div className="avatar mt-4"><div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"><img src={editFormData.trainerProfilePic} alt="Profile preview"/></div></div>
                                )}
                            </div>
                            <div className="modal-action">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn">Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? <span className="loading loading-spinner"></span> : "Save Changes"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Class Modal */}
            {showCreateClass && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">Create New Class</h3>
                        <form className="space-y-4">
                            {/* Form fields for creating a new class */}
                        </form>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowCreateClass(false)}>Cancel</button>
                            <button className="btn btn-primary">Create Class</button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default TrainerDashboard;