import { useEffect } from 'react';
import { trainerStore } from '../storeData/trainerStore.js';
import TrainerProfileCard from '../components/trainer/TrainerProfileCard.jsx'; // ✅ Changed import
import Spinner from '../components/common/Spinner';

const Trainers = () => {
    const { trainers, isLoading, error, fetchAllTrainers } = trainerStore();

    useEffect(() => {
        fetchAllTrainers();
    }, [fetchAllTrainers]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center pt-20">
                    <Spinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">Unable to Load Trainers</h2>
                    <p className="text-base-content/60 mb-6">{error}</p>
                    <button 
                        onClick={fetchAllTrainers}
                        className="btn btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

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

            {trainers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {trainers.map(trainer => (
                        <TrainerProfileCard key={trainer._id} trainer={trainer} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-base-content/60 py-20">
                    <p>No trainers are available at the moment. Please check back soon!</p>
                </div>
            )}
        </div>
    );
};

export default Trainers;