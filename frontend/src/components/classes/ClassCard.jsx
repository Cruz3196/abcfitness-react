import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";

const ClassCard = ({ classInfo }) => {
  const isFull = classInfo.attendees?.length >= classInfo.capacity;

  return (
    <div className="card bg-base-100 border border-base-300 hover:border-primary/50 transition-colors">
      <Link to={`/classes/${classInfo._id}`}>
        <figure className="relative">
          <img
            src={
              classInfo.classPic || "https://placehold.co/400x300?text=Class"
            }
            alt={classInfo.classTitle}
            className="h-48 w-full object-cover"
          />
          {isFull && (
            <span className="absolute top-2 right-2 badge badge-error text-xs">
              Full
            </span>
          )}
        </figure>
      </Link>

      <div className="card-body p-4">
        <span className="text-xs text-base-content/60 uppercase tracking-wide">
          {classInfo.classType}
        </span>

        <Link to={`/classes/${classInfo._id}`}>
          <h2 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
            {classInfo.classTitle}
          </h2>
        </Link>

        <div className="flex items-center gap-3 text-xs text-base-content/70 mt-1">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {classInfo.trainer?.user?.username || "TBD"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {classInfo.duration}min
          </span>
        </div>

        <p className="text-xs text-base-content/60 mt-1">
          {classInfo.timeSlot?.day} • {classInfo.timeSlot?.startTime}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold">${classInfo.price}</span>
          <Link to={`/classes/${classInfo._id}`}>
            <button
              className={`btn btn-sm ${
                isFull ? "btn-disabled" : "btn-primary"
              }`}
            >
              {isFull ? "Full" : "Book"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
