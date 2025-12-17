import { Link } from "react-router-dom";
import { Users, Clock } from "lucide-react";

const TrainerCard = ({ classItem }) => {
  if (!classItem) return null;

  const formatTime = (time) => {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(":");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <Link
      to={`/trainer/my-classes/${classItem._id}`}
      className="card bg-base-100 border border-base-300 hover:border-primary/50 transition-colors"
    >
      <figure>
        <img
          src={classItem.classPic || "https://placehold.co/400x300?text=Class"}
          alt={classItem.classTitle || "Class"}
          className="h-36 w-full object-cover"
        />
      </figure>
      <div className="card-body p-3">
        <p className="text-xs text-base-content/60 uppercase tracking-wide">
          {classItem.classType || "Class"}
        </p>
        <h3 className="font-medium text-sm line-clamp-1">
          {classItem.classTitle || "Untitled Class"}
        </h3>

        <div className="flex items-center gap-3 text-xs text-base-content/60 mt-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {classItem.timeSlot?.day || "N/A"}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {classItem.attendees?.length || 0}/{classItem.capacity || 0}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TrainerCard;
