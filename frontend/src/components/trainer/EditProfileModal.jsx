import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { userStore } from '../../storeData/userStore';

const EditProfileModal = ({ isOpen, onClose, user }) => {
    const { updateTrainerProfile } = userStore();
    const [editFormData, setEditFormData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            setEditFormData({
                username: user?.username || '',
                email: user?.email || '',
                specialization: user.trainerProfile.specialization || '',
                bio: user.trainerProfile.bio || '',
                certifications: user.trainerProfile.certifications || '',
                experience: user.trainerProfile.experience || 0,
                trainerProfilePic: user.trainerProfile.trainerProfilePic || ''
            });
        }
    }, [isOpen, user]);

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

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await updateTrainerProfile(editFormData);
        setIsSubmitting(false);
        if (success) {
            onClose();
        }
    };

    if (!isOpen || !editFormData) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl relative">
                <button onClick={onClose} className="btn btn-sm btn-circle absolute right-2 top-2">
                    <X size={20} />
                </button>
                <h3 className="font-bold text-lg mb-4">Edit Your Profile</h3>
                <form onSubmit={handleSubmitUpdate} className="space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input 
                            type="text" 
                            name="username" 
                            value={editFormData.username} 
                            onChange={handleInputChange} 
                            className="input input-bordered w-full" 
                        />
                    </div>
                    
                    <div>
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input 
                            type="email" 
                            name="email" 
                            value={editFormData.email} 
                            onChange={handleInputChange} 
                            className="input input-bordered w-full" 
                        />
                    </div>
                    
                    <div>
                        <label className="label">
                            <span className="label-text">Specialization</span>
                        </label>
                        <input 
                            type="text" 
                            name="specialization" 
                            value={editFormData.specialization} 
                            onChange={handleInputChange} 
                            className="input input-bordered w-full" 
                        />
                    </div>
                    
                    <div>
                        <label className="label">
                            <span className="label-text">Bio</span>
                        </label>
                        <textarea 
                            name="bio" 
                            value={editFormData.bio} 
                            onChange={handleInputChange} 
                            className="textarea textarea-bordered w-full" 
                            rows="3"
                        />
                    </div>
                    
                    <div>
                        <label className="label">
                            <span className="label-text">Certifications</span>
                        </label>
                        <input 
                            type="text" 
                            name="certifications" 
                            value={editFormData.certifications} 
                            onChange={handleInputChange} 
                            className="input input-bordered w-full" 
                        />
                    </div>
                    
                    <div>
                        <label className="label">
                            <span className="label-text">Years of Experience</span>
                        </label>
                        <input 
                            type="number" 
                            name="experience" 
                            value={editFormData.experience} 
                            onChange={handleInputChange} 
                            className="input input-bordered w-full" 
                        />
                    </div>
                    
                    <div>
                        <label className="label">
                            <span className="label-text">Profile Picture</span>
                        </label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="file-input file-input-bordered w-full" 
                        />
                        {editFormData.trainerProfilePic && (
                            <div className="avatar mt-4">
                                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={editFormData.trainerProfilePic} alt="Profile preview"/>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="modal-action">
                        <button type="button" onClick={onClose} className="btn">Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? <span className="loading loading-spinner"></span> : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;