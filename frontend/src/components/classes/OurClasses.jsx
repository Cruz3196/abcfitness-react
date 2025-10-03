import { useEffect } from 'react';
import { classStore } from '../../storeData/classStore.js';
import ClassCard from './ClassCard';

const OurClasses = () => {
    const { classes, isLoading, fetchAllClasses } = classStore();

    useEffect(() => {
        fetchAllClasses();
    }, [fetchAllClasses]);

    // Get first 3 classes for featured section (or all if you want)
    const featuredClasses = classes.slice(0, 4);

    if (isLoading) {
        return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
            </div>
        </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center my-8">
                <h2 className="text-3xl font-bold">Explore Our Classes</h2>
                <p className="text-gray-600 mt-6">Find the perfect class to match your fitness goals and schedule.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredClasses.map((classInfo) => (
                <ClassCard key={classInfo._id} classInfo={classInfo} />
                ))}
            </div>

            {featuredClasses.length === 0 && !isLoading && (
                <div className="text-center text-gray-500 py-12">
                <p>No classes available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default OurClasses;