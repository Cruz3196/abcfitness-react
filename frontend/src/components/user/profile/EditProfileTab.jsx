import React from "react";
import { Eye, EyeOff } from "lucide-react";

const EditProfileTab = React.memo(
  ({
    profileForm,
    passwordForm,
    handleInputChange,
    handlePasswordInputChange,
    handleUpdateProfile,
    handleChangePassword,
    setActiveTab,
    setShowDeleteModal,
    isLoading,
    isChangingPassword,
  }) => {
    const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);

    return (
      <div className="space-y-6">
        {/* Profile Info Form */}
        <div className="bg-base-200 rounded-lg">
          <div className="p-4 border-b border-base-300">
            <h2 className="font-semibold">Profile Information</h2>
          </div>
          <form onSubmit={handleUpdateProfile}>
            <div className="divide-y divide-base-300">
              <div className="p-4">
                <label className="block text-sm text-base-content/60 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="input input-bordered input-sm w-full max-w-md"
                  value={profileForm.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="p-4">
                <label className="block text-sm text-base-content/60 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="input input-bordered input-sm w-full max-w-md"
                  value={profileForm.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="p-4 border-t border-base-300 flex gap-3">
              <button
                type="submit"
                className={`btn btn-primary btn-sm ${
                  isLoading ? "loading" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setActiveTab("view")}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Password Change Form */}
        <div className="bg-base-200 rounded-lg">
          <div className="p-4 border-b border-base-300">
            <h2 className="font-semibold">Change Password</h2>
          </div>
          <form onSubmit={handleChangePassword}>
            <div className="divide-y divide-base-300">
              <div className="p-4">
                <label className="block text-sm text-base-content/60 mb-1">
                  Current Password
                </label>
                <div className="relative max-w-md">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    className="input input-bordered input-sm w-full pr-10"
                    value={passwordForm?.currentPassword || ""}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <label className="block text-sm text-base-content/60 mb-1">
                  New Password
                </label>
                <div className="relative max-w-md">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    className="input input-bordered input-sm w-full pr-10"
                    value={passwordForm?.newPassword || ""}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-base-content/50 mt-1">
                  Must be at least 6 characters
                </p>
              </div>
              <div className="p-4">
                <label className="block text-sm text-base-content/60 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="input input-bordered input-sm w-full max-w-md"
                  value={passwordForm?.confirmPassword || ""}
                  onChange={handlePasswordInputChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="p-4 border-t border-base-300">
              <button
                type="submit"
                className={`btn btn-primary btn-sm ${
                  isChangingPassword ? "loading" : ""
                }`}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-base-200 rounded-lg">
          <div className="p-4 border-b border-base-300">
            <h2 className="font-semibold text-error">Close Account</h2>
          </div>
          <div className="p-4">
            <p className="text-sm text-base-content/60 mb-3">
              Permanently delete your account and all associated data.
            </p>
            <button
              type="button"
              className="text-error text-sm hover:underline"
              onClick={() => setShowDeleteModal(true)}
            >
              Close your ABC Fitness account
            </button>
          </div>
        </div>
      </div>
    );
  }
);

EditProfileTab.displayName = "EditProfileTab";

export default EditProfileTab;
