import { useState, useEffect } from "react";
import { userStore } from "../storeData/userStore";

import TrainerProfileTab from "../components/trainer/TrainerProfileTab";
import TrainerClassesTab from "../components/trainer/TrainerClassesTab";
import TrainerEditTab from "../components/trainer/TrainerEditTab";
import CreateClassModal from "../components/trainer/CreateClassModal";

const TrainerDashboard = () => {
  const { user, fetchMyClasses, checkAuthStatus } = userStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [showCreateClass, setShowCreateClass] = useState(false);

  useEffect(() => {
    const initializeDashboard = async () => {
      if (user && !user.trainerProfile) {
        await checkAuthStatus(true);
      }
      if (user?.isTrainer) {
        await fetchMyClasses();
      }
    };
    initializeDashboard();
  }, [user?.isTrainer]);

  if (!user || !user.trainerProfile) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <p className="text-sm text-base-content/60 mt-1">
          Welcome back, {user.username}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-base-300 mb-6">
        <button
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "profile"
              ? "border-primary text-primary"
              : "border-transparent text-base-content/60 hover:text-base-content"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "edit"
              ? "border-primary text-primary"
              : "border-transparent text-base-content/60 hover:text-base-content"
          }`}
          onClick={() => setActiveTab("edit")}
        >
          Edit Profile
        </button>
        <button
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "classes"
              ? "border-primary text-primary"
              : "border-transparent text-base-content/60 hover:text-base-content"
          }`}
          onClick={() => setActiveTab("classes")}
        >
          My Classes
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "classes" && (
        <TrainerClassesTab
          user={user}
          onCreateClass={() => setShowCreateClass(true)}
        />
      )}

      {activeTab === "profile" && (
        <TrainerProfileTab
          user={user}
          onEditProfile={() => setActiveTab("edit")}
        />
      )}

      {activeTab === "edit" && (
        <TrainerEditTab user={user} onSaved={() => setActiveTab("profile")} />
      )}

      {/* Modal */}
      <CreateClassModal
        isOpen={showCreateClass}
        onClose={() => setShowCreateClass(false)}
      />
    </div>
  );
};

export default TrainerDashboard;
