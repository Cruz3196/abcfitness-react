import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import TrainerCard from "./TrainerCard";

const TrainerClassesTab = ({ user, onCreateClass, itemVariants }) => {
    const handleEditClass = (classData) => {
        alert(`Editing: ${classData.classTitle}`);
    };

    const handleDeleteClass = (classId) => {
        alert(`Deleting class with ID: ${classId}`);
    };

    return (
        <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">My Classes ({user.classes?.length || 0})</h2>
                <button className="btn btn-primary gap-2 btn-md" onClick={onCreateClass}>
                    <Plus className="w-4 h-4" /> Create New Class
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {user?.classes?.length > 0 ? (
                    user.classes.map(classItem => (
                        <TrainerCard 
                            key={classItem._id} 
                            classItem={classItem} 
                            onEdit={handleEditClass}
                            onDelete={handleDeleteClass} 
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <h3 className="text-xl font-semibold mb-4">No Classes Yet</h3>
                        <p className="text-base-content/60 mb-6">You haven't created any classes yet.</p>
                        <button 
                            onClick={onCreateClass}
                            className="btn btn-primary"
                        >
                            Create Your First Class
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TrainerClassesTab;