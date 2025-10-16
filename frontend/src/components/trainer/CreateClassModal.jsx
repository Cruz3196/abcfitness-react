import React, { useState } from 'react';
import { X } from 'lucide-react';
import { userStore } from '../../storeData/userStore';

const CreateClassModal = ({ isOpen, onClose }) => {
    const { createClass } = userStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        price: 0 
    };

    const [newClassData, setNewClassData] = useState(initialClassState);

    const handleClassInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith('timeSlot.')) {
            const timeSlotField = name.split('.')[1];
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
            onClose();
            setNewClassData(initialClassState);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl relative">
                <button onClick={onClose} className="btn btn-sm btn-circle absolute right-2 top-2">
                    <X size={20}/>
                </button>
                <h3 className="font-bold text-lg mb-4">Create New Class</h3>
                
                <form onSubmit={handleCreateClassSubmit} className="space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Class Title</span>
                        </label>
                        <input 
                            type="text" 
                            name="classTitle" 
                            value={newClassData.classTitle} 
                            onChange={handleClassInputChange} 
                            required 
                            className="input input-bordered w-full" 
                        />
                    </div>
                    
                    <div>
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea 
                            name="classDescription" 
                            value={newClassData.classDescription} 
                            onChange={handleClassInputChange} 
                            className="textarea textarea-bordered w-full" 
                            rows="3"
                        />
                    </div>
                    
                    <div>
                        <label className="label">
                            <span className="label-text">Class Type</span>
                        </label>
                        <select 
                            name="classType" 
                            value={newClassData.classType} 
                            onChange={handleClassInputChange} 
                            className="select select-bordered w-full"
                        >
                            <option value="">Select Type</option>
                            <option>Cycle</option>
                            <option>Cardio</option>
                            <option>HIIT</option>
                            <option>Zumba</option>
                            <option>Bootcamp</option>
                            <option>BodySculpt</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="label">
                                <span className="label-text">Day</span>
                            </label>
                            <select 
                                name="timeSlot.day" 
                                value={newClassData.timeSlot.day} 
                                onChange={handleClassInputChange} 
                                required 
                                className="select select-bordered w-full"
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
                        
                        <div>
                            <label className="label">
                                <span className="label-text">Start Time</span>
                            </label>
                            <input 
                                type="time" 
                                name="timeSlot.startTime" 
                                value={newClassData.timeSlot.startTime} 
                                onChange={handleClassInputChange} 
                                required 
                                className="input input-bordered w-full" 
                            />
                        </div>
                        
                        <div>
                            <label className="label">
                                <span className="label-text">End Time</span>
                            </label>
                            <input 
                                type="time" 
                                name="timeSlot.endTime" 
                                value={newClassData.timeSlot.endTime} 
                                onChange={handleClassInputChange} 
                                required 
                                className="input input-bordered w-full" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">
                                <span className="label-text">Duration (minutes)</span>
                            </label>
                            <input 
                                type="number" 
                                name="duration" 
                                value={newClassData.duration} 
                                onChange={handleClassInputChange} 
                                className="input input-bordered w-full" 
                            />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">Capacity</span>
                            </label>
                            <input 
                                type="number" 
                                name="capacity" 
                                value={newClassData.capacity} 
                                onChange={handleClassInputChange} 
                                className="input input-bordered w-full" 
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="label">
                            <span className="label-text">Price ($)</span>
                        </label>
                        <input 
                            type="number" 
                            name="price" 
                            value={newClassData.price} 
                            onChange={handleClassInputChange} 
                            className="input input-bordered w-full" 
                        />
                    </div>
                    
                    <div>
                        <label className="label">
                            <span className="label-text">Class Picture</span>
                        </label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleClassFileChange} 
                            className="file-input file-input-bordered w-full" 
                        />
                    </div>
                    
                    <div className="modal-action">
                        <button type="button" onClick={onClose} className="btn">Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? <span className="loading loading-spinner"></span> : "Create Class"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateClassModal;