import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Users, DollarSign, Clock, Calendar } from 'lucide-react';

const TrainerCard = ({ classItem, onEdit, onDelete }) => {
    // Return early if classItem is not provided
    if (!classItem) {
        return (
            <div className="card bg-base-100 shadow-lg p-4">
                <div className="text-center text-base-content/60">
                    <p>No class data available</p>
                </div>
            </div>
        );
    }

    // A simple function to format time
    const formatTime = (time) => {
        if (!time) return 'N/A';
        const [hours, minutes] = time.split(':');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // convert to 12-hour format
        return `${formattedHours}:${minutes} ${ampm}`;
    };

    return (
        <div className="card bg-base-200 shadow-lg transition-all duration-300 hover:shadow-2xl flex flex-col">
            <Link to={`/trainer/my-classes/${classItem._id}`} className="flex-grow">
                <figure className="relative">
                    <img
                        src={classItem.classPic || 'https://placehold.co/400x225?text=Class'}
                        alt={classItem.classTitle || 'Class'}
                        className="h-48 w-full object-cover"
                    />
                    <div className="absolute top-2 right-2 badge badge-secondary font-bold">
                        {classItem.classType || 'Class'}
                    </div>
                </figure>
                <div className="card-body p-4">
                    <h2 className="card-title truncate">{classItem.classTitle || 'Untitled Class'}</h2>
                    <p className="text-base-content/70 text-sm mb-2 line-clamp-2">
                        {classItem.classDescription || 'No description available'}
                    </p>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-primary"/> 
                            <span>
                                {classItem.timeSlot?.day || 'N/A'} at {formatTime(classItem.timeSlot?.startTime)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-primary"/> 
                            <span>
                                {classItem.attendees?.length || 0} / {classItem.capacity || 0} registered
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
            
            {/* <div className="card-actions justify-end p-4 pt-0">
                <button className="btn btn-outline btn-sm gap-2" onClick={(e) => { e.stopPropagation(); onEdit(classItem); }}>
                    <Edit size={14} /> Edit
                </button>
                <button className="btn btn-outline btn-error btn-sm gap-2" onClick={(e) => { e.stopPropagation(); onDelete(classItem._id); }}>
                    <Trash2 size={14} /> Delete
                </button>
            </div> */}
        </div>
    );
};

export default TrainerCard;