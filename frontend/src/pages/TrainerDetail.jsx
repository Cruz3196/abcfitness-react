import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { trainerStore } from '../storeData/trainerStore.js';
import Spinner from '../components/common/Spinner';
import ClassCard from '../components/classes/ClassCard';
import Breadcrumbs from '../components/common/Breadcrumbs'; // Step 1: Import the component

const TrainerDetail = () => {
    const { id } = useParams();
    const { trainers, isLoading, getTrainerById, fetchAllTrainers, fetchClassesByTrainer } = trainerStore();

    useEffect(() => {
        if (trainers.length === 0) {
        fetchAllTrainers();
        }
    }, [trainers, fetchAllTrainers]);

    const trainer = getTrainerById(id);
    const trainerClasses = trainer ? fetchClassesByTrainer(trainer._id) : [];

    if (isLoading && !trainer) {
        return <div className="flex justify-center pt-20"><Spinner /></div>;
    }

    if (!trainer) {
        return (
        <div className="text-center py-20">
            <h2 className="text-3xl font-bold">Trainer Not Found</h2>
            <Link to="/trainers" className="btn btn-primary mt-6">Back to All Trainers</Link>
        </div>
        );
    }

    // Step 2: Define the array of paths for the breadcrumbs
    const breadcrumbPaths = [
        { name: 'Home', link: '/' },
        { name: 'Trainers', link: '/trainers' },
        { name: trainer.user.username, link: `/trainers/${id}` }
    ];

    return (
        <div className="bg-base-200">
        {/* Trainer Hero Section */}
        <div className="hero min-h-[40vh]" style={{ backgroundImage: `url(https://placehold.co/1200x400?text=${trainer.user.username})` }}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content flex-col md:flex-row gap-8">
            <img src={trainer.trainerProfilePic || 'https://placehold.co/150x150?text=Trainer'} alt={trainer.user.username} className="w-40 h-40 object-cover rounded-full border-4 border-primary shadow-2xl" />
                <div className="max-w-md text-left">
                    <h1 className="mb-2 text-5xl font-bold">{trainer.user.username}</h1>
                    <p className="mb-5 text-xl text-primary font-semibold">{trainer.specialization}</p>
                    <p>{trainer.bio}</p>
                </div>
            </div>
        </div>

        {/* Trainer's Classes Section */}
            <div className="container mx-auto px-4 py-12">
                 {/* Step 3: Render the Breadcrumbs component */}
                <div className="mb-8">
                    <Breadcrumbs paths={breadcrumbPaths} />
                </div>
                <h2 className="text-3xl font-bold text-center mb-8">Classes by {trainer.user.username}</h2>
                {trainerClasses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trainerClasses.map(classInfo => (
                            <ClassCard key={classInfo._id} classInfo={classInfo} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-base-content/70">This trainer does not have any upcoming classes scheduled.</p>
                )}
            </div>
        </div>
    );
};

export default TrainerDetail;

