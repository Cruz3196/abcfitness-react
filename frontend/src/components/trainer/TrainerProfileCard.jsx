import { Link } from "react-router-dom";
import { Award } from "lucide-react";

const TrainerProfileCard = ({ trainer }) => {
  if (!trainer) {
    return null;
  }

  return (
    <div className="card bg-base-100 border border-base-300 hover:border-primary/50 transition-colors">
      <Link to={`/trainers/${trainer._id}`}>
        <figure className="pt-6 px-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto">
            <img
              src={
                trainer.trainerProfilePic ||
                "https://placehold.co/150x150?text=T"
              }
              alt={trainer.user?.username || "Trainer"}
              className="w-full h-full object-cover"
            />
          </div>
        </figure>

        <div className="card-body p-4 text-center">
          <h2 className="font-medium">
            {trainer.user?.username || "Unknown Trainer"}
          </h2>

          {trainer.specialization && (
            <p className="text-xs text-base-content/60 uppercase tracking-wide">
              {trainer.specialization}
            </p>
          )}

          {trainer.yearsOfExperience && (
            <p className="text-xs text-base-content/50 flex items-center justify-center gap-1 mt-1">
              <Award className="w-3 h-3" />
              {trainer.yearsOfExperience} years exp.
            </p>
          )}

          <button className="btn btn-primary btn-sm mt-3">View Profile</button>
        </div>
      </Link>
    </div>
  );
};

export default TrainerProfileCard;
