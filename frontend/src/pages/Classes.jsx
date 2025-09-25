import React, { useEffect } from 'react';
import ClassCard from '../components/classes/ClassCard';
import Spinner from '../components/common/Spinner';
import { classStore } from '../storeData/classStore';

const Classes = () => {
    const { classes, isLoading, error, fetchAllClasses, clearError } = classStore();

    useEffect(() => {
        fetchAllClasses();
        
        // Clear any existing errors when component mounts
        return () => {
            clearError();
        };
    }, [fetchAllClasses, clearError]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="hero min-h-[30vh] bg-base-200 rounded-box mb-12">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Our Classes</h1>
                        <p className="py-6">Find the perfect class to match your fitness goals, led by our expert trainers.</p>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center pt-20">
                    <Spinner />
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <div className="alert alert-error max-w-md mx-auto">
                        <span>{error}</span>
                    </div>
                    <button 
                        onClick={fetchAllClasses}
                        className="btn btn-primary mt-4"
                    >
                        Try Again
                    </button>
                </div>
            ) : classes.length === 0 ? (
                <div className="text-center text-base-content/60 py-20">
                    <div className="max-w-md mx-auto">
                        <h3 className="text-xl font-semibold mb-4">No Classes Available</h3>
                        <p>No classes are available at the moment. Please check back soon!</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {classes.map(classInfo => (
                        <ClassCard key={classInfo._id} classInfo={classInfo} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Classes;