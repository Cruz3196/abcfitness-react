import React, { useState } from "react";
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../api/axios";

const AdminProfile = ({ user }) => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password strength validation rules
  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 6) {
      errors.push("At least 6 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("One uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("One lowercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("One number");
    }

    return errors;
  };

  // Real-time password validation
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, newPassword: value });

    if (value) {
      const errors = validatePassword(value);
      setPasswordErrors((prev) => ({ ...prev, newPassword: errors }));
    } else {
      setPasswordErrors((prev) => ({ ...prev, newPassword: [] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.currentPassword) {
      toast.error("Current password is required");
      return;
    }

    const newPasswordErrors = validatePassword(formData.newPassword);
    if (newPasswordErrors.length > 0) {
      toast.error("New password does not meet security requirements");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put("/user/updateProfile", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.status === 200) {
        toast.success("Password changed successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordErrors({});
        setIsChangePasswordOpen(false);
      }
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to change password. Please try again.");
      }
      console.error("Error changing password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (!formData.newPassword) return "";
    const errors = validatePassword(formData.newPassword);
    if (errors.length === 0) return "text-success";
    if (errors.length <= 2) return "text-warning";
    return "text-error";
  };

  const getPasswordStrengthText = () => {
    if (!formData.newPassword) return "";
    const errors = validatePassword(formData.newPassword);
    if (errors.length === 0) return "Strong";
    if (errors.length <= 2) return "Fair";
    return "Weak";
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-base-100 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-content">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              {user?.username}
            </h2>
            <p className="text-base-content/60">{user?.email}</p>
            <div className="badge badge-primary mt-2">Admin</div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary/10 border-b border-base-300 px-6 py-4">
          <h3 className="text-lg font-semibold text-base-content flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security Settings
          </h3>
        </div>

        <div className="p-6">
          {/* Password Change Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-base-content mb-1">
                  Password
                </h4>
                <p className="text-sm text-base-content/60">
                  Keep your account secure by changing your password regularly
                </p>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(!isChangePasswordOpen)}
                className="btn btn-sm btn-outline btn-primary"
              >
                {isChangePasswordOpen ? "Cancel" : "Change Password"}
              </button>
            </div>

            {/* Change Password Form */}
            {isChangePasswordOpen && (
              <div className="mt-6 pt-6 border-t border-base-300">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Current Password */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Current Password
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        placeholder="Enter your current password"
                        value={formData.currentPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="input input-bordered w-full pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            current: !showPasswords.current,
                          })
                        }
                        className="absolute right-3 top-3 text-base-content/60 hover:text-base-content"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        New Password
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={handleNewPasswordChange}
                        className="input input-bordered w-full pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            new: !showPasswords.new,
                          })
                        }
                        className="absolute right-3 top-3 text-base-content/60 hover:text-base-content"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.newPassword && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/60">
                            Password Strength:
                          </span>
                          <span
                            className={`text-sm font-semibold ${getPasswordStrengthColor()}`}
                          >
                            {getPasswordStrengthText()}
                          </span>
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-base-200 rounded-lg p-4 space-y-2">
                          <p className="text-xs font-semibold text-base-content/70 uppercase">
                            Requirements:
                          </p>
                          {[
                            {
                              req: "At least 6 characters",
                              met: formData.newPassword.length >= 6,
                            },
                            {
                              req: "One uppercase letter",
                              met: /[A-Z]/.test(formData.newPassword),
                            },
                            {
                              req: "One lowercase letter",
                              met: /[a-z]/.test(formData.newPassword),
                            },
                            {
                              req: "One number",
                              met: /\d/.test(formData.newPassword),
                            },
                          ].map((item) => (
                            <div
                              key={item.req}
                              className="flex items-center gap-2"
                            >
                              {item.met ? (
                                <CheckCircle className="w-4 h-4 text-success" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-error" />
                              )}
                              <span
                                className={`text-xs ${
                                  item.met
                                    ? "text-success"
                                    : "text-base-content/60"
                                }`}
                              >
                                {item.req}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Confirm Password
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className={`input input-bordered w-full pr-10 ${
                          formData.confirmPassword &&
                          formData.newPassword !== formData.confirmPassword
                            ? "input-error"
                            : ""
                        }`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            confirm: !showPasswords.confirm,
                          })
                        }
                        className="absolute right-3 top-3 text-base-content/60 hover:text-base-content"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {formData.confirmPassword &&
                      formData.newPassword !== formData.confirmPassword && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            Passwords do not match
                          </span>
                        </label>
                      )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary flex-1"
                    >
                      {isLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangePasswordOpen(false);
                        setFormData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setPasswordErrors({});
                      }}
                      disabled={isLoading}
                      className="btn btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Security Tips */}
          <div className="mt-8 pt-6 border-t border-base-300">
            <h4 className="font-semibold text-base-content mb-3">
              Security Tips
            </h4>
            <ul className="space-y-2 text-sm text-base-content/70">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Use a strong, unique password with mixed characters</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Change your password every 3 months</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Never share your password with anyone</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Sign out after each session</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
