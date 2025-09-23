import { useEffect } from 'react';
import { trainerStore } from '../storeData/trainerStore.js';
import TrainerCard from '../components/trainer/TrainerCard.jsx';
import Spinner from '../components/common/Spinner';

const Trainers = () => {
    const { trainers, isLoading, fetchAllTrainers } = trainerStore();

    useEffect(() => {
        fetchAllTrainers();
    }, [fetchAllTrainers]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="hero min-h-[30vh] bg-base-200 rounded-box mb-12">
                <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Meet Our Trainers</h1>
                    <p className="py-6">Our certified professionals are here to guide, motivate, and help you achieve your fitness goals.</p>
                </div>
                </div>
            </div>

        {isLoading ? (
            <div className="flex justify-center pt-20"><Spinner /></div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {trainers.map(trainer => (
                <TrainerCard key={trainer._id} trainer={trainer} />
            ))}
            </div>
        )}
        
        {trainers.length === 0 && !isLoading && (
            <div className="text-center text-base-content/60 py-20">
            <p>No trainers are available at the moment. Please check back soon!</p>
            </div>
        )}
        </div>
    );
};

export default Trainers;