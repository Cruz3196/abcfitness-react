import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { userStore } from '../storeData/userStore';
import { ArrowLeft } from 'lucide-react';

// Import child components
import ClassDetailsCard from '../components/trainer/ClassDetailsCard';
import ClassActionsCard from '../components/trainer/ClassActionsCard';
import ClassRosterCard from '../components/trainer/ClassRosterCard';
import EditClassModal from '../components/trainer/EditClassModal';
import DeleteClassModal from '../components/trainer/DeleteClassModal';
import Spinner from '../components/common/Spinner';

const TrainerClassDetail = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const { selectedClass, isLoading, fetchClassById, clearSelectedClass, updateClass, deleteClass } = userStore();

    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Fetch class details when component mounts or classId changes
    useEffect(() => {
        if (classId) {
            fetchClassById(classId);
        }

        return () => {
            clearSelectedClass();
        };
    }, [classId, fetchClassById, clearSelectedClass]);

    // Handler functions
    const handleEditClass = () => setShowEditModal(true);
    const handleDeleteClass = () => setShowDeleteModal(true);

    const handleEditSubmit = async (editFormData) => {
        const success = await updateClass(classId, editFormData);
        if (success) {
            setShowEditModal(false);
        }
        return success;
    };

    const handleDeleteConfirm = async () => {
        const success = await deleteClass(classId);
        if (success) {
            const { fetchMyClasses } = userStore.getState();
            await fetchMyClasses();
            navigate('/trainerdashboard');
        }
        return success;
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (!selectedClass) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
                <h2 className="text-2xl font-bold mb-4">Class Not Found</h2>
                <button 
                    onClick={() => navigate("/trainerdashboard")} 
                    className="btn btn-primary"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Back Link */}
                <div className="mb-6">
                    <Link to="/trainerdashboard" className="btn btn-ghost gap-2">
                        <ArrowLeft size={16} /> Back to My Classes
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Class Details */}
                    <div className="lg:col-span-2">
                        <ClassDetailsCard classData={selectedClass} />
                    </div>

                    {/* Right Column: Actions & Roster */}
                    <div className="space-y-6">
                        <ClassActionsCard 
                            onEdit={handleEditClass}
                            onDelete={handleDeleteClass}
                        />
                        <ClassRosterCard attendees={selectedClass.attendees || []} />
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showEditModal && (
                <EditClassModal
                    isOpen={showEditModal}
                    classData={selectedClass}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={handleEditSubmit}
                    isLoading={isLoading}
                />
            )}

            {showDeleteModal && (
                <DeleteClassModal
                    isOpen={showDeleteModal}
                    classTitle={selectedClass.classTitle}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default TrainerClassDetail;