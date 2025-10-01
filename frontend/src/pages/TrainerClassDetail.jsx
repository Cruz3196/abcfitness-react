import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { userStore } from '../storeData/userStore';
import { ArrowLeft, Calendar, Clock, Users, DollarSign, Edit, Trash2, Mail, X, Upload } from 'lucide-react';

const TrainerClassDetail = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const { selectedClass, isLoading, fetchClassById, clearSelectedClass, updateClass, deleteClass } = userStore();

    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [imagePreview, setImagePreview] = useState('');

    // Fetch class details when component mounts or classId changes ==========================================================
    useEffect(() => {
        if (classId) {
            fetchClassById(classId);
        }

        // Cleanup function to clear the class data when the component unmounts
        return () => {
            clearSelectedClass();
        };
    }, [classId, fetchClassById, clearSelectedClass]);

    // handler for deletion and updating a class ==========================================================
    useEffect(() => {
        if (selectedClass) {
            setEditFormData({
                classTitle: selectedClass.classTitle || '',
                classDescription: selectedClass.classDescription || '',
                classType: selectedClass.classType || '',
                duration: selectedClass.duration || '',
                timeSlot: selectedClass.timeSlot || { day: '', startTime: '' },
                capacity: selectedClass.capacity || '',
                classPic: selectedClass.classPic || ''
            });
            // Set image preview to current class picture
            setImagePreview(selectedClass.classPic || '');
        }
    }, [selectedClass]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const success = await updateClass(classId, editFormData);
        if (success) {
            setShowEditModal(false);
            setImagePreview('');
        }
    };

    const handleDeleteConfirm = async () => {
        const success = await deleteClass(classId);
        if (success) {
            // ✅ FIX: Refresh the classes list before navigating
            const { fetchMyClasses } = userStore.getState();
            await fetchMyClasses();
            
            navigate('/trainerdashboard');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name.includes('timeSlot.')) {
            const field = name.split('.')[1];
            setEditFormData(prev => ({
                ...prev,
                timeSlot: {
                    ...prev.timeSlot,
                    [field]: value
                }
            }));
        } else {
            setEditFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle file change for class picture
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setImagePreview(base64String);
                setEditFormData(prev => ({
                    ...prev,
                    classPic: base64String
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Reset image to original
    const handleResetImage = () => {
        setImagePreview(selectedClass.classPic || '');
        setEditFormData(prev => ({
            ...prev,
            classPic: selectedClass.classPic || ''
        }));
    };

    // Remove image
    const handleRemoveImage = () => {
        setImagePreview('');
        setEditFormData(prev => ({
            ...prev,
            classPic: ''
        }));
    };

    // if loading then show a spinner
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }
    // if the select class is not found then show a message
    if (!selectedClass) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
                <h2 className="text-2xl font-bold mb-4">Class Not Found</h2>
                <button 
                    onClick={() => navigate("/trainerdashboard")} 
                    className="btn btn-primary">
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
            </div>
        );
    }
    
    // If not, you'll need to adjust your backend to populate this field.
    const attendees = selectedClass.attendees || [];

    return (
        <div className="min-h-screen bg-base-200 p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
            {/* Back Link */}
            <div className="mb-6">
                <Link to="/trainerdashboard" className="btn btn-ghost gap-2">
                    <ArrowLeft size={16} /> Back to My Classes
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Class Details */}
                <div className="lg:col-span-2">
                    <div className="card bg-base-100 shadow-xl">
                        <figure>
                            <img src={selectedClass.classPic || 'https://placehold.co/600x300?text=Class+Image'} alt={selectedClass.classTitle} className="h-64 w-full object-cover" />
                        </figure>
                        <div className="card-body">
                            <h1 className="card-title text-3xl font-bold">{selectedClass.classTitle}</h1>
                            <p className="text-lg text-primary font-semibold">{selectedClass.classType}</p>
                            <p className="mt-2 text-base-content/80">{selectedClass.classDescription}</p>
                            
                            <div className="divider"></div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4 text-md">
                                <div className="flex items-center gap-3"><Calendar className="text-secondary"/><span>{selectedClass.timeSlot.day} at {selectedClass.timeSlot.startTime}</span></div>
                                <div className="flex items-center gap-3"><Clock className="text-secondary"/><span>{selectedClass.duration} mins</span></div>
                                <div className="flex items-center gap-3"><Users className="text-secondary"/><span>{attendees.length} / {selectedClass.capacity} spots filled</span></div>
                                <div className="flex items-center gap-3"><DollarSign className="text-secondary"/><span>${selectedClass.price}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Roster & Actions */}
                <div className="space-y-6">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Actions</h2>
                            <div className="flex flex-col gap-2 mt-2">
                                <button 
                                    onClick={() => setShowEditModal(true)}
                                    className="btn btn-primary gap-2"
                                >
                                    <Edit size={16}/> Edit Class
                                </button>
                                <button 
                                    onClick={() => setShowDeleteModal(true)}
                                    className="btn btn-error btn-outline gap-2"
                                >
                                    <Trash2 size={16}/> Delete Class
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Class Roster ({attendees.length})</h2>
                            <div className="mt-2 space-y-3 max-h-96 overflow-y-auto">
                                {attendees.length > 0 ? (
                                    attendees.map((attendee, index) => (
                                        <div key={attendee._id || index} className="flex items-center justify-between p-2 rounded-lg bg-base-200">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                                                        <span>
                                                            {/* ✅ Safety check: handle both populated and non-populated attendees */}
                                                            {attendee.username ? 
                                                                attendee.username.substring(0, 2).toUpperCase() : 
                                                                'U' + (index + 1)
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <span>
                                                    {/* ✅ Safety check for username */}
                                                    {attendee.username || `User ${index + 1}`}
                                                </span>
                                            </div>
                                            {attendee.email && (
                                                <a href={`mailto:${attendee.email}`} className="btn btn-ghost btn-sm btn-circle">
                                                    <Mail size={16} />
                                                </a>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-base-content/60 p-4">No one has registered yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-4xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Edit Class</h3>
                            <button 
                                onClick={() => setShowEditModal(false)}
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            {/* Class Picture Section */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Class Picture</span>
                                </label>
                                <div className="flex flex-col gap-4">
                                    {/* Current/Preview Image */}
                                    <div className="flex justify-center">
                                        <div className="relative">
                                            <img 
                                                src={imagePreview || 'https://placehold.co/400x200?text=No+Image'} 
                                                alt="Class preview" 
                                                className="w-full max-w-md h-48 object-cover rounded-lg border"
                                            />
                                        </div>
                                    </div>

                                    {/* Image Controls */}
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        <label className="btn btn-outline btn-sm gap-2">
                                            <Upload size={16} />
                                            Upload New Image
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                        
                                        {imagePreview !== selectedClass.classPic && (
                                            <button 
                                                type="button"
                                                onClick={handleResetImage}
                                                className="btn btn-ghost btn-sm"
                                            >
                                                Reset to Original
                                            </button>
                                        )}
                                        
                                        {imagePreview && (
                                            <button 
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="btn btn-error btn-outline btn-sm"
                                            >
                                                Remove Image
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="text-xs text-base-content/60 text-center">
                                        Supported formats: JPG, PNG, GIF. Max size: 5MB
                                    </div>
                                </div>
                            </div>

                            <div className="divider"></div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">Class Title</label>
                                    <input
                                        type="text"
                                        name="classTitle"
                                        value={editFormData.classTitle}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">Class Type</label>
                                    <select
                                        name="classType"
                                        value={editFormData.classType}
                                        onChange={handleInputChange}
                                        className="select select-bordered"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Yoga">Yoga</option>
                                        <option value="Pilates">Pilates</option>
                                        <option value="HIIT">HIIT</option>
                                        <option value="Strength Training">Strength Training</option>
                                        <option value="Cardio">Cardio</option>
                                        <option value="Dance">Dance</option>
                                        <option value="BodySculpt">BodySculpt</option>
                                    </select>
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={editFormData.duration}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">Capacity</label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        value={editFormData.capacity}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">Price ($)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={editFormData.price || ''}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">Day</label>
                                    <select
                                        name="timeSlot.day"
                                        value={editFormData.timeSlot?.day || ''}
                                        onChange={handleInputChange}
                                        className="select select-bordered"
                                        required
                                    >
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
                                
                                <div className="form-control">
                                    <label className="label">Start Time</label>
                                    <input
                                        type="time"
                                        name="timeSlot.startTime"
                                        value={editFormData.timeSlot?.startTime || ''}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-control">
                                <label className="label">Description</label>
                                <textarea
                                    name="classDescription"
                                    value={editFormData.classDescription}
                                    onChange={handleInputChange}
                                    className="textarea textarea-bordered h-24"
                                    required
                                ></textarea>
                            </div>
                            
                            <div className="modal-action">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setImagePreview('');
                                    }} 
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                    {isLoading ? <span className="loading loading-spinner"></span> : 'Update Class'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Delete Class</h3>
                        <p className="mb-6">Are you sure you want to delete "{selectedClass.classTitle}"? This action cannot be undone.</p>
                        
                        <div className="modal-action">
                            <button onClick={() => setShowDeleteModal(false)} className="btn btn-ghost">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} className="btn btn-error" disabled={isLoading}>
                                {isLoading ? <span className="loading loading-spinner"></span> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainerClassDetail;