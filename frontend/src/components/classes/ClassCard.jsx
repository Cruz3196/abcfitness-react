import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, DollarSign, Clock } from 'lucide-react';

const ClassCard = ({ classInfo }) => {
    return (
        <div className="card w-70 bg-base-100 shadow-lg transition-all duration-300 hover:shadow-1xl">
            <Link to={`/classes/${classInfo._id}`}>
                <figure className="relative">
                    <img
                        src={classInfo.classPic || 'https://placehold.co/400x225?text=Class'}
                        alt={classInfo.classTitle}
                        className="h-48 w-full object-cover"
                    />      
                    <div className="absolute top-2 right-2 badge badge-secondary font-bold capitalize">
                        {classInfo.classType}
                    </div>
                </figure>
            </Link>
            
            <div className="card-body p-4">
                <h2 className="card-title truncate" title={classInfo.classTitle}>
                    <Link to={`/classes/${classInfo._id}`} className="hover:text-secondary">
                        {classInfo.classTitle}
                    </Link>
                </h2>
                
                <p className="text-base-content/70 text-sm mb-3 line-clamp-2">
                    {classInfo.classDescription}
                </p>
                
                <p className="text-sm mb-3">
                    with{' '}
                    <Link 
                        to={`/trainers/${classInfo.trainer?._id}`} 
                        className="link link-hover text-primary font-semibold"
                    >
                        {classInfo.trainer?.user?.username || 'TBD'}
                    </Link>
                </p>

                <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <span>{classInfo.timeSlot?.day} at {classInfo.timeSlot?.startTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-primary" />
                        <span>{classInfo.duration} minutes</span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                        <Users size={16} className="text-primary" />
                        <span>{classInfo.attendees?.length || 0} / {classInfo.capacity} Spots</span>

                        {(classInfo.attendees?.length >= classInfo.capacity) && (
                            <span className="badge badge-error badge-sm ml-1">FULL</span>
                        )}
                    </div> */}
                    <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-primary" />
                        <span>${classInfo.price}</span>
                    </div>
                </div>

                <div className="card-actions justify-end">
                    <Link to={`/classes/${classInfo._id}`}>
                        <button 
                            className={`btn btn-sm ${
                                classInfo.attendees?.length >= classInfo.capacity 
                                    ? 'btn-disabled' 
                                    : 'btn-primary'
                            }`}
                        >
                            {classInfo.attendees?.length >= classInfo.capacity 
                                ? 'Class Full' 
                                : 'View Details'
                            }
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ClassCard;