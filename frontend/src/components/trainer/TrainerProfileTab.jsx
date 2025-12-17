import { Edit, Award, Clock, FileText } from "lucide-react";

const TrainerProfileTab = ({ user, onEditProfile }) => {
  return (
    <div className="border border-base-300 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src={
                user?.trainerProfile?.trainerProfilePic ||
                "https://placehold.co/150"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-medium">{user.username}</h2>
              <p className="text-sm text-primary mt-1">
                {user?.trainerProfile?.specialization}
              </p>
            </div>
            <button
              className="btn btn-sm btn-outline gap-2"
              onClick={onEditProfile}
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <FileText className="w-4 h-4 text-base-content/50 mt-0.5 flex-shrink-0" />
              <p className="text-base-content/70">
                {user?.trainerProfile?.bio || "No bio provided."}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Award className="w-4 h-4 text-base-content/50 flex-shrink-0" />
              <p className="text-base-content/70">
                {user?.trainerProfile?.certifications ||
                  "No certifications listed."}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-base-content/50 flex-shrink-0" />
              <p className="text-base-content/70">
                {user?.trainerProfile?.experience} years of experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfileTab;
