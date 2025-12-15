import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../storeData/userStore";
import toast from "react-hot-toast";

const TrainerProfileSetup = () => {
  const [formData, setFormData] = useState({
    specialization: "",
    bio: "",
    certifications: "",
    experience: "",
    trainerProfilePic: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { createTrainerProfile, user, needsTrainerSetup } = userStore();

  // Redirect if trainer already has profile set up
  useEffect(() => {
    if (user && user.role === "trainer" && user.hasTrainerProfile) {
      toast.info("Profile already completed. Redirecting to dashboard...");
      navigate("/trainerdashboard", { replace: true });
    } else if (user && user.role !== "trainer") {
      // If not a trainer, redirect to appropriate page
      toast.error("Access denied. This page is for trainers only.");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          trainerProfilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await createTrainerProfile(formData);
      if (success) {
        navigate("/trainerdashboard");
      }
    } catch (error) {
      toast.error("Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render the form if user already has profile or isn't a trainer
  if (!user || user.role !== "trainer" || user.hasTrainerProfile) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-base-content/70">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-base-100 rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-base-content">
            Complete Your Trainer Profile
          </h2>
          <p className="text-base-content/70 text-center mb-8">
            Please fill out your trainer information to get started.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                Specialization *
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                required
                className="input input-bordered w-full"
                placeholder="e.g., Strength Training, Yoga, Cardio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="textarea textarea-bordered w-full"
                placeholder="Tell us about yourself and your training philosophy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                Certifications
              </label>
              <input
                type="text"
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="e.g., NASM, ACE, ACSM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                min="0"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
              />
              {formData.trainerProfilePic && (
                <img
                  src={formData.trainerProfilePic}
                  alt="Profile preview"
                  className="mt-4 w-32 h-32 object-cover rounded-full mx-auto"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.specialization}
              className="btn btn-primary w-full"
            >
              {isLoading ? "Creating Profile..." : "Complete Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfileSetup;
