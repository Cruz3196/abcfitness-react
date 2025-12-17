import { useEffect } from "react";
import ClassCard from "../components/classes/ClassCard";
import Spinner from "../components/common/Spinner";
import { classStore } from "../storeData/classStore";

const Classes = () => {
  const { classes, isLoading, error, fetchAllClasses, clearError } =
    classStore();

  useEffect(() => {
    fetchAllClasses();
    return () => clearError();
  }, [fetchAllClasses, clearError]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Classes</h1>
        <p className="text-sm text-base-content/60 mt-1">
          {classes.length} class{classes.length !== 1 ? "es" : ""} available
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-error mb-4">{error}</p>
          <button onClick={fetchAllClasses} className="btn btn-primary btn-sm">
            Try Again
          </button>
        </div>
      ) : classes.length === 0 ? (
        <p className="text-center text-base-content/50 py-12">
          No classes available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {classes.map((classInfo) => (
            <ClassCard key={classInfo._id} classInfo={classInfo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Classes;
