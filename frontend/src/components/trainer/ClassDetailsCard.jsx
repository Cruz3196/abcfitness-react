import React from 'react';
import { Calendar, Clock, Users, DollarSign } from 'lucide-react';

const ClassDetailsCard = ({ classData }) => {
    const attendees = classData.attendees || [];

    return (
        <div className="card bg-base-100 shadow-xl">
            <figure>
                <img 
                    src={classData.classPic || 'https://placehold.co/600x300?text=Class+Image'} 
                    alt={classData.classTitle} 
                    className="h-64 w-full object-cover" 
                />
            </figure>
            <div className="card-body">
                <h1 className="card-title text-3xl font-bold">{classData.classTitle}</h1>
                <p className="text-lg text-primary font-semibold">{classData.classType}</p>
                <p className="mt-2 text-base-content/80">{classData.classDescription}</p>
                
                <div className="divider"></div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 text-md">
                    <div className="flex items-center gap-3">
                        <Calendar className="text-secondary"/>
                        <span>{classData.timeSlot.day} at {classData.timeSlot.startTime}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="text-secondary"/>
                        <span>{classData.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="text-secondary"/>
                        <span>{attendees.length} / {classData.capacity} spots filled</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <DollarSign className="text-secondary"/>
                        <span>${classData.price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailsCard;