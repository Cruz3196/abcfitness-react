import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../../storeData/userStore";
import { useOrderStore } from "../../../storeData/useOrderStore";
import toast from "react-hot-toast";

export const useCustomerProfile = () => {
  const navigate = useNavigate();

  const {
    user,
    logout,
    updateProfile,
    deleteUserAccount,
    bookings,
    fetchMyBookings,
    isLoading: isUserLoading,
    isLoadingBookings,
  } = userStore();

  const {
    orders,
    isLoading: isLoadingOrders,
    fetchOrderHistory,
    clearOrders,
  } = useOrderStore();

  const [activeTab, setActiveTab] = useState("view");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Booking data memoization
  const { upcomingBookings, totalBookings } = useMemo(() => {
    if (!bookings || !Array.isArray(bookings)) {
      return { upcomingBookings: [], totalBookings: 0 };
    }

    const now = new Date();

    const upcoming = bookings.filter((booking) => {
      if (!booking) return false;
      try {
        const bookingDate = new Date(booking.sessionDate || booking.startTime);
        return bookingDate > now;
      } catch {
        return false;
      }
    });

    return {
      upcomingBookings: upcoming,
      totalBookings: bookings.length,
    };
  }, [bookings]);

  // Fetch bookings when bookings tab is active
  useEffect(() => {
    if (activeTab === "bookings") {
      fetchMyBookings();
    }
  }, [activeTab, fetchMyBookings]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
      clearOrders();
      return;
    }

    if (user && (!profileForm.username || !profileForm.email)) {
      setProfileForm({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user, navigate, clearOrders, profileForm.username, profileForm.email]);

  // Sync profileImage with store's user.profileImage
  useEffect(() => {
    if (user) {
      setProfileImage(user.profileImage || "");
    }
  }, [user?.profileImage]);

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (!user) return;

    if (activeTab === "orders" && orders.length === 0) {
      console.log("Fetching orders data");
      fetchOrderHistory();
    }
  }, [activeTab, user, fetchOrderHistory, orders.length]);

  // Handlers
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      clearOrders();
      navigate("/");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout");
    }
  }, [logout, clearOrders, navigate]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleProfileImageChange = useCallback(
    async (base64Image) => {
      if (!base64Image) return;

      setIsUploadingImage(true);
      try {
        const success = await updateProfile({ profileImage: base64Image });
        if (success) {
          setProfileImage(base64Image);
        }
      } catch {
        toast.error("Failed to update profile picture");
      } finally {
        setIsUploadingImage(false);
      }
    },
    [updateProfile]
  );

  const handleDeleteProfileImage = useCallback(async () => {
    setIsUploadingImage(true);
    try {
      const success = await updateProfile({ profileImage: "" });
      if (success) {
        setProfileImage("");
      }
    } catch {
      toast.error("Failed to remove profile picture");
    } finally {
      setIsUploadingImage(false);
    }
  }, [updateProfile]);

  const handlePasswordInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleUpdateProfile = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await updateProfile(profileForm);
        setActiveTab("view");
      } catch {
        toast.error("Failed to update profile");
      }
    },
    [updateProfile, profileForm]
  );

  const handleChangePassword = useCallback(
    async (e) => {
      e.preventDefault();

      // Validation
      if (!passwordForm.currentPassword || !passwordForm.newPassword) {
        toast.error("Please fill in all password fields");
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters");
        return;
      }

      setIsChangingPassword(true);
      try {
        const success = await updateProfile({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        });

        if (success) {
          setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      } catch {
        toast.error("Failed to change password");
      } finally {
        setIsChangingPassword(false);
      }
    },
    [updateProfile, passwordForm]
  );

  const handleDeleteAccount = useCallback(async () => {
    try {
      await deleteUserAccount();
      clearOrders();
      navigate("/");
      toast.success("Account deleted successfully");
    } catch {
      toast.error("Failed to delete account");
    }
  }, [deleteUserAccount, clearOrders, navigate]);

  return {
    // State
    user,
    orders,
    activeTab,
    showDeleteModal,
    profileForm,
    passwordForm,
    profileImage,
    upcomingBookings,
    totalBookings,

    // Loading states
    isUserLoading,
    isLoadingOrders,
    isLoadingBookings,
    isChangingPassword,
    isUploadingImage,

    // Setters
    setActiveTab,
    setShowDeleteModal,

    // Handlers
    handleLogout,
    handleInputChange,
    handlePasswordInputChange,
    handleProfileImageChange,
    handleDeleteProfileImage,
    handleUpdateProfile,
    handleChangePassword,
    handleDeleteAccount,
  };
};
