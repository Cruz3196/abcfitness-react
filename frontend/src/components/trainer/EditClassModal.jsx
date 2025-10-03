import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ImageUpload from './ImageUpload'

const EditClassModal = ({ isOpen, classData, onClose, onSubmit, isLoading }) => {
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        if (classData) {
            setEditFormData({
                classTitle: classData.classTitle || '',
                classDescription: classData.classDescription || '',
                classType: classData.classType || '',
                duration: classData.duration || '',
                timeSlot: classData.timeSlot || { day: '', startTime: '' },
                capacity: classData.capacity || '',
                price: classData.price || '',
                classPic: classData.classPic || ''
            });
        }
    }, [classData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(editFormData);
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

    const handleImageChange = (imageData) => {
        setEditFormData(prev => ({
            ...prev,
            classPic: imageData
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Edit Class</h3>
                    <button 
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost"
                    >
                        <X size={16} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <ImageUpload
                        currentImage={editFormData.classPic}
                        onImageChange={handleImageChange}
                        label="Class Picture"
                    />

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
                                <option value="BootCamp">BootCamp</option>
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
                            onClick={onClose} 
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
    );
};

export default EditClassModal;