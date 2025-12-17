import { useState, useEffect } from "react";
import { Camera, Save } from "lucide-react";
import { userStore } from "../../storeData/userStore";

const TrainerEditTab = ({ user, onSaved }) => {
  const { updateTrainerProfile } = userStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    specialization: "",
    bio: "",
    certifications: "",
    experience: 0,
    trainerProfilePic: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user?.username || "",
        email: user?.email || "",
        specialization: user.trainerProfile?.specialization || "",
        bio: user.trainerProfile?.bio || "",
        certifications: user.trainerProfile?.certifications || "",
        experience: user.trainerProfile?.experience || 0,
        trainerProfilePic: user.trainerProfile?.trainerProfilePic || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, trainerProfilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await updateTrainerProfile(formData);
    setIsSubmitting(false);
    if (success && onSaved) {
      onSaved();
    }
  };

  return (
    <div className="border border-base-300 rounded-lg">
      <div className="p-4 border-b border-base-300">
        <h2 className="font-medium">Edit Profile</h2>
        <p className="text-sm text-base-content/60 mt-1">
          Update your trainer information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Photo */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border border-base-300">
                  <img
                    src={
                      formData.trainerProfilePic || "https://placehold.co/150"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 btn btn-sm btn-circle btn-primary cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-base-content/50 mt-3 text-center">
                Click the camera icon to change photo
              </p>
            </div>
          </div>

          {/* Right - Form Fields */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-base-content/70 mb-1 block">
                  Name
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="input input-bordered input-sm w-full"
                />
              </div>
              <div>
                <label className="text-sm text-base-content/70 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input input-bordered input-sm w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-base-content/70 mb-1 block">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="e.g., Yoga, CrossFit, Strength Training"
                  className="input input-bordered input-sm w-full"
                />
              </div>
              <div>
                <label className="text-sm text-base-content/70 mb-1 block">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  className="input input-bordered input-sm w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-base-content/70 mb-1 block">
                Certifications
              </label>
              <input
                type="text"
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                placeholder="e.g., ACE Certified, NASM-CPT"
                className="input input-bordered input-sm w-full"
              />
            </div>

            <div>
              <label className="text-sm text-base-content/70 mb-1 block">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell clients about yourself, your training style, and what makes you unique..."
                className="textarea textarea-bordered textarea-sm w-full"
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6 pt-4 border-t border-base-300">
          <button
            type="submit"
            className="btn btn-primary btn-sm gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainerEditTab;
