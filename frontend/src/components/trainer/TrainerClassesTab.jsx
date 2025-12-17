import { Plus } from "lucide-react";
import TrainerCard from "./TrainerCard";

const TrainerClassesTab = ({ user, onCreateClass }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-base-content/60">
          {user.classes?.length || 0} class
          {user.classes?.length !== 1 ? "es" : ""}
        </p>
        <button
          className="btn btn-primary btn-sm gap-2"
          onClick={onCreateClass}
        >
          <Plus className="w-4 h-4" /> New Class
        </button>
      </div>

      {user?.classes?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {user.classes.map((classItem) => (
            <TrainerCard key={classItem._id} classItem={classItem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-base-300 rounded-lg">
          <p className="text-base-content/50 mb-4">No classes yet</p>
          <button onClick={onCreateClass} className="btn btn-primary btn-sm">
            Create Your First Class
          </button>
        </div>
      )}
    </div>
  );
};

export default TrainerClassesTab;
