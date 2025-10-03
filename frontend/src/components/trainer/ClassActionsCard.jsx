import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const ClassActionsCard = ({ onEdit, onDelete }) => {
    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Actions</h2>
                <div className="flex flex-col gap-2 mt-2">
                    <button 
                        onClick={onEdit}
                        className="btn btn-primary gap-2"
                    >
                        <Edit size={16}/> Edit Class
                    </button>
                    <button 
                        onClick={onDelete}
                        className="btn btn-error btn-outline gap-2"
                    >
                        <Trash2 size={16}/> Delete Class
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassActionsCard;