import React from 'react';
import { Link } from 'react-router-dom';
import { User, Star, MapPin, Award } from 'lucide-react';

const TrainerProfileCard = ({ trainer }) => {
    // Safety check
    if (!trainer) {
        return (
            <div className="card bg-base-100 shadow-lg p-4">
                <div className="text-center text-base-content/60">
                    <p>No trainer data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-lg transition-all duration-300 hover:shadow-2xl">
            <Link to={`/trainers/${trainer._id}`}>
                <figure className="px-6 pt-6">
                    <div className="avatar">
                        <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img 
                                src={trainer.trainerProfilePic || 'https://placehold.co/150x150/60a5fa/ffffff?text=T'} 
                                alt={trainer.user?.username || 'Trainer'} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </figure>
                
                <div className="card-body text-center">
                    <h2 className="card-title justify-center text-xl">
                        {trainer.user?.username || 'Unknown Trainer'}
                    </h2>
                    
                    {trainer.specialization && (
                        <div className="badge badge-secondary mb-2 mx-auto">
                            {trainer.specialization}
                        </div>
                    )}
                    
                    <p className="text-base-content/70 text-sm mb-4 line-clamp-3">
                        {trainer.bio || 'Passionate fitness professional ready to help you achieve your goals.'}
                    </p>
                    
                    <div className="flex flex-col gap-2 text-xs text-base-content/60">
                        {trainer.yearsOfExperience && (
                            <div className="flex items-center justify-center gap-1">
                                <Award size={14} />
                                <span>{trainer.yearsOfExperience} years experience</span>
                            </div>
                        )}
                        
                        {trainer.certifications && (
                            <div className="flex items-center justify-center gap-1">
                                <Star size={14} />
                                <span>Certified</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="card-actions justify-center mt-4">
                        <div className="btn btn-primary btn-sm">
                            View Profile
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default TrainerProfileCard;