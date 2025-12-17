import { useEffect } from "react";
import { Link } from "react-router-dom";
import { classStore } from "../../storeData/classStore.js";
import ClassCard from "./ClassCard";
import { ArrowRight } from "lucide-react";

const OurClasses = () => {
  const { classes, isLoading, fetchAllClasses } = classStore();

  useEffect(() => {
    fetchAllClasses();
  }, [fetchAllClasses]);

  const featuredClasses = classes.slice(0, 4);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    );
  }

  if (featuredClasses.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium">Popular Classes</h2>
          <p className="text-sm text-base-content/60 mt-1">
            Find the perfect class for your fitness goals
          </p>
        </div>
        <Link
          to="/classes"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          See all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {featuredClasses.map((classInfo) => (
          <ClassCard key={classInfo._id} classInfo={classInfo} />
        ))}
      </div>
    </div>
  );
};

export default OurClasses;
