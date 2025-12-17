import { useEffect } from "react";
import { trainerStore } from "../storeData/trainerStore.js";
import TrainerProfileCard from "../components/trainer/TrainerProfileCard.jsx";
import Spinner from "../components/common/Spinner";

const Trainers = () => {
  const { trainers, isLoading, error, fetchAllTrainers } = trainerStore();

  useEffect(() => {
    fetchAllTrainers();
  }, [fetchAllTrainers]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Our Trainers</h1>
        <p className="text-sm text-base-content/60 mt-1">
          {trainers.length} trainer{trainers.length !== 1 ? "s" : ""} ready to
          help you
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-error mb-4">{error}</p>
          <button onClick={fetchAllTrainers} className="btn btn-primary btn-sm">
            Try Again
          </button>
        </div>
      ) : trainers.length === 0 ? (
        <p className="text-center text-base-content/50 py-12">
          No trainers available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {trainers.map((trainer) => (
            <TrainerProfileCard key={trainer._id} trainer={trainer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Trainers;
