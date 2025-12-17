import React from "react";
import { ChevronRight } from "lucide-react";

const ProfileInfoCard = React.memo(({ user, setActiveTab }) => (
  <div className="bg-base-200 rounded-lg">
    <div className="p-4 border-b border-base-300">
      <h2 className="font-semibold">Login & Security</h2>
    </div>
    <div className="divide-y divide-base-300">
      <div className="p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-base-content/60">Name</p>
          <p className="font-medium">{user.username}</p>
        </div>
        <button
          onClick={() => setActiveTab("edit")}
          className="text-primary text-sm hover:underline"
        >
          Edit
        </button>
      </div>
      <div className="p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-base-content/60">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <button
          onClick={() => setActiveTab("edit")}
          className="text-primary text-sm hover:underline"
        >
          Edit
        </button>
      </div>
      <div className="p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-base-content/60">Account Type</p>
          <p className="font-medium capitalize">{user.role}</p>
        </div>
      </div>
      <div className="p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-base-content/60">Password</p>
          <p className="font-medium">••••••••</p>
        </div>
        <button
          onClick={() => setActiveTab("edit")}
          className="text-primary text-sm hover:underline"
        >
          Change
        </button>
      </div>
    </div>
  </div>
));

ProfileInfoCard.displayName = "ProfileInfoCard";

export default ProfileInfoCard;
