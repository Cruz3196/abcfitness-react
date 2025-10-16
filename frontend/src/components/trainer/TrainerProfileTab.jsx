import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Info, Award, Clock } from 'lucide-react';

const TrainerProfileTab = ({ user, onEditProfile, itemVariants }) => {
    return (
        <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
            <div className="card-body">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="avatar">
                        <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img 
                                src={user?.trainerProfile?.trainerProfilePic || 'https://placehold.co/150'} 
                                alt="Trainer Profile"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 flex-1">
                        <h2 className="card-title text-3xl mb-2 justify-center sm:justify-start">
                            {user.username}
                        </h2>
                        <p className="font-semibold text-primary text-lg text-center sm:text-start">
                            {user?.trainerProfile?.specialization}
                        </p>
                        <div className="mt-4 space-y-3 text-base-content/90">
                            <div className="flex items-center gap-3">
                                <Info className="w-5 h-5 shrink-0" />
                                <p>{user?.trainerProfile?.bio || "No bio provided."}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Award className="w-5 h-5 shrink-0" />
                                <p>{user?.trainerProfile?.certifications || "No certifications listed."}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 shrink-0" />
                                <p>{user?.trainerProfile?.experience} years of experience</p>
                            </div>
                        </div>
                        <div className="card-actions justify-center sm:justify-end mt-6">
                            <button className="btn btn-primary gap-2" onClick={onEditProfile}>
                                <Edit className="w-4 h-4"/>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TrainerProfileTab;