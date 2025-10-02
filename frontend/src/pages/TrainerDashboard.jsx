import React, { useState, useEffect } from 'react';
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

// import a component to display individual class cards
import TrainerCard from "../components/trainer/TrainerCard";

const TrainerDashboard = () => {
    // ✅ CHANGE: We now get the complete user object, which includes the trainer profile and classes.
    const { user, updateTrainerProfile, createClass, fetchMyClasses, username, email } = userStore();
    const [activeTab, setActiveTab] = useState('profile');

    // ✅ ADDED: State management for the modals and form data
    const [showCreateClass, setShowCreateClass] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // FOR UPDATING TRAINER PROFILE============================================================

    // ✅ ADDED: Handler to open the modal and pre-fill it with current data
    const handleOpenEditModal = () => {
        setEditFormData({
            username: user?.username || '',
            email: user?.email || '',
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

    // FOR CREATING NEW CLASSES ============================================================

    const initialClassState = {
        classTitle: '',
        classDescription: '',
        classType: '',
        duration: 60,
        timeSlot: {
            day: '',
            startTime: '',
            endTime: ''
        },
        classPic: '',
        capacity: 10,
        price: 0 // ✅ Add default price
    };
    const [newClassData, setNewClassData] = useState(initialClassState);

    const handleClassInputChange = (e) => {
        const { name, value } = e.target;
        
        // ✅ FIX: Handle nested timeSlot object
        if (name.startsWith('timeSlot.')) {
            const timeSlotField = name.split('.')[1]; // Get 'day', 'startTime', or 'endTime'
            setNewClassData(prev => ({
                ...prev,
                timeSlot: {
                    ...prev.timeSlot,
                    [timeSlotField]: value
                }
            }));
        } else {
            setNewClassData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleClassFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewClassData(prev => ({ ...prev, classPic: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateClassSubmit = async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
        const success = await createClass(newClassData);
            setIsSubmitting(false);
        if (success) {
            setShowCreateClass(false);
            setNewClassData(initialClassState); // Reset form
        }
    };

    // FETCHING CREATING NEW CLASSES ============================================================
    useEffect(() => {

        if (user?.isTrainer) {
            fetchMyClasses();
        }
    }, [user?.isTrainer, fetchMyClasses]);

    // Placeholder functions for the card actions
    const handleEditClass = (classData) => {
        // TODO: Implement this. For example, open a modal pre-filled with classData.
        alert(`Editing: ${classData.classTitle}`);
    };

    const handleDeleteClass = (classId) => {
        // TODO: Implement this. For example, show a confirmation modal before deleting.
        alert(`Deleting class with ID: ${classId}`);
    };

    // if a trainer, and has completed the profile setup before rendering the dashboard.
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
                            <h2 className="text-2xl font-bold">My Classes ({user.classes?.length || 0})</h2>
                            <button className="btn btn-primary gap-2" onClick={() => setShowCreateClass(true)}>
                                <Plus className="w-4 h-4" /> Create New Class
                            </button>
                        </div>
                        
                        {/* ✅ FIXED: Access user.classes instead of user.trainerProfile.classes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {user?.classes?.length > 0 ? (
                                user.classes.map(classItem => (
                                    <TrainerCard 
                                        key={classItem._id} 
                                        classItem={classItem} 
                                        onEdit={handleEditClass}        // ✅ Fixed: use correct handler
                                        onDelete={handleDeleteClass} 
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <h3 className="text-xl font-semibold mb-4">No Classes Yet</h3>
                                    <p className="text-base-content/60 mb-6">You haven't created any classes yet.</p>
                                    <button 
                                        onClick={() => setShowCreateClass(true)}
                                        className="btn btn-primary"
                                    >
                                        Create Your First Class
                                    </button>
                                </div>
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
                            <div><label className="label"><span className="label-text">Name</span></label><input type="text" name="username" value={editFormData.username} onChange={handleInputChange} className="input input-bordered w-full" /></div>
                            <div><label className="label"><span className="label-text">Email</span></label><input type="email" name="email" value={editFormData.email} onChange={handleInputChange} className="input input-bordered w-full" /></div>
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
                    <div className="modal-box max-w-2xl relative">
                        <button onClick={() => setShowCreateClass(false)} className="btn btn-sm btn-circle absolute right-2 top-2"><X size={20}/></button>
                        <h3 className="font-bold text-lg mb-4">Create New Class</h3>
                        
                        <form onSubmit={handleCreateClassSubmit} className="space-y-4">
                            <div>
                                <label className="label"><span className="label-text">Class Title</span></label>
                                <input type="text" name="classTitle" value={newClassData.classTitle} onChange={handleClassInputChange} required className="input input-bordered w-full" />
                            </div>
                            
                            <div>
                                <label className="label"><span className="label-text">Description</span></label>
                                <textarea name="classDescription" value={newClassData.classDescription} onChange={handleClassInputChange} className="textarea textarea-bordered w-full" rows="3"></textarea>
                            </div>
                            
                            <div>
                                <label className="label"><span className="label-text">Class Type</span></label>
                                <select name="classType" value={newClassData.classType} onChange={handleClassInputChange} className="select select-bordered w-full">
                                    <option>Cycle</option>
                                    <option>Cardio</option>
                                    <option>HIIT</option>
                                    <option>Zumba</option>
                                    <option>Bootcamp</option>
                                    <option>BodySculpt</option>
                                </select>
                            </div>

                            {/* ✅ FIXED: Replace single datetime-local with separate day, start time, and end time inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="label"><span className="label-text">Day</span></label>
                                    <select name="timeSlot.day" value={newClassData.timeSlot.day} onChange={handleClassInputChange} required className="select select-bordered w-full">
                                        <option value="">Select Day</option>
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Friday">Friday</option>
                                        <option value="Saturday">Saturday</option>
                                        <option value="Sunday">Sunday</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="label"><span className="label-text">Start Time</span></label>
                                    <input type="time" name="timeSlot.startTime" value={newClassData.timeSlot.startTime} onChange={handleClassInputChange} required className="input input-bordered w-full" />
                                </div>
                                
                                <div>
                                    <label className="label"><span className="label-text">End Time</span></label>
                                    <input type="time" name="timeSlot.endTime" value={newClassData.timeSlot.endTime} onChange={handleClassInputChange} required className="input input-bordered w-full" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label"><span className="label-text">Duration (minutes)</span></label>
                                    <input type="number" name="duration" value={newClassData.duration} onChange={handleClassInputChange} className="input input-bordered w-full" />
                                </div>
                                <div>
                                    <label className="label"><span className="label-text">Capacity</span></label>
                                    <input type="number" name="capacity" value={newClassData.capacity} onChange={handleClassInputChange} className="input input-bordered w-full" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="label"><span className="label-text">Price ($)</span></label>
                                <input type="number" name="price" value={newClassData.price} onChange={handleClassInputChange} className="input input-bordered w-full" />
                            </div>
                            
                            <div>
                                <label className="label"><span className="label-text">Class Picture</span></label>
                                <input type="file" accept="image/*" onChange={handleClassFileChange} className="file-input file-input-bordered w-full" />
                            </div>
                            
                            <div className="modal-action">
                                <button type="button" onClick={() => setShowCreateClass(false)} className="btn">Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? <span className="loading loading-spinner"></span> : "Create Class"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default TrainerDashboard;