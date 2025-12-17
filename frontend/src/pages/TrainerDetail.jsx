import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Award, Clock, Mail } from "lucide-react";
import { trainerStore } from "../storeData/trainerStore.js";
import Spinner from "../components/common/Spinner";
import ClassCard from "../components/classes/ClassCard";

const TrainerDetail = () => {
  const { id } = useParams();
  const {
    selectedTrainer,
    trainerClasses,
    isLoading,
    error,
    fetchTrainerById,
    fetchClassesByTrainer,
    clearSelectedTrainer,
  } = trainerStore();

  useEffect(() => {
    if (id) {
      fetchTrainerById(id);
      fetchClassesByTrainer(id);
    }

    return () => {
      clearSelectedTrainer();
    };
  }, [id, fetchTrainerById, fetchClassesByTrainer, clearSelectedTrainer]);

  if (isLoading) {
    return (
      <div className="flex justify-center pt-20">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-medium mb-2">Error Loading Trainer</h2>
        <p className="text-sm text-base-content/60 mb-4">{error}</p>
        <Link to="/trainers" className="btn btn-sm btn-primary">
          Back to Trainers
        </Link>
      </div>
    );
  }

  if (!selectedTrainer) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-medium mb-4">Trainer Not Found</h2>
        <Link to="/trainers" className="btn btn-sm btn-primary">
          Back to Trainers
        </Link>
      </div>
    );
  }

  const trainerName = selectedTrainer.user?.username || "Unknown Trainer";
  const trainerEmail = selectedTrainer.user?.email || "";
  const trainerBio = selectedTrainer.bio || "No bio available";
  const trainerSpecialization =
    selectedTrainer.specialization || "General Fitness";
  const trainerProfilePic =
    selectedTrainer.trainerProfilePic || "https://placehold.co/150";
  const trainerExperience = selectedTrainer.experience || 0;
  const trainerCertifications = selectedTrainer.certifications || "";

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-6">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/trainers">Trainers</Link>
          </li>
          <li>{trainerName}</li>
        </ul>
      </div>

      {/* Trainer Profile */}
      <div className="border border-base-300 rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-28 h-28 rounded-full overflow-hidden border border-base-300">
              <img
                src={trainerProfilePic}
                alt={trainerName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-medium">{trainerName}</h1>
            <p className="text-primary text-sm mt-1">{trainerSpecialization}</p>

            <p className="text-sm text-base-content/70 mt-4 leading-relaxed">
              {trainerBio}
            </p>

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-base-content/60">
              {trainerExperience > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {trainerExperience} years experience
                </span>
              )}
              {trainerCertifications && (
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {trainerCertifications}
                </span>
              )}
              {trainerEmail && (
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {trainerEmail}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Classes Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">
            Classes by {trainerName}
            {trainerClasses?.length > 0 && (
              <span className="text-sm text-base-content/50 font-normal ml-2">
                ({trainerClasses.length})
              </span>
            )}
          </h2>
        </div>

        {trainerClasses && trainerClasses.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {trainerClasses.map((classInfo) => (
              <ClassCard key={classInfo._id} classInfo={classInfo} />
            ))}
          </div>
        ) : (
          <div className="border border-base-300 rounded-lg p-8 text-center">
            <p className="text-sm text-base-content/60">
              No upcoming classes scheduled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDetail;
