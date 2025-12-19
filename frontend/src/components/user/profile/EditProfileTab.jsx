import React, { useRef } from "react";
import { Eye, EyeOff, Upload, Trash2 } from "lucide-react";

const EditProfileTab = React.memo(
  ({
    profileForm,
    passwordForm,
    profileImage,
    handleInputChange,
    handlePasswordInputChange,
    handleProfileImageChange,
    handleDeleteProfileImage,
    handleUpdateProfile,
    handleChangePassword,
    setActiveTab,
    setShowDeleteModal,
    isLoading,
    isChangingPassword,
    isUploadingImage,
  }) => {
    const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        handleProfileImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    };

    return (
      <div className="space-y-6">
        {/* Profile Picture Section */}
        <div className="bg-base-200 rounded-lg">
          <div className="p-4 border-b border-base-300">
            <h2 className="font-semibold">Profile Picture</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-6">
              {/* Current Profile Image */}
              <div className="relative">
                <div className="avatar">
                  <div className="w-24 h-24 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2">
                    <img
                      src={profileImage || "https://placehold.co/96x96"}
                      alt="Profile"
                      className="object-cover"
                    />
                  </div>
                </div>
                {isUploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <span className="loading loading-spinner loading-md text-white"></span>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <p className="text-sm text-base-content/60 mb-3">
                  Upload a new profile picture. JPG, PNG or GIF. Max 5MB.
                </p>
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                  >
                    <Upload className="w-4 h-4" />
                    {isUploadingImage ? "Uploading..." : "Upload Photo"}
                  </button>
                  {profileImage && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm gap-2 text-error hover:bg-error/10"
                      onClick={handleDeleteProfileImage}
                      disabled={isUploadingImage}
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

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
