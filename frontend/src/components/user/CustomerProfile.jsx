import { User, Package, Calendar, Settings, ChevronRight } from "lucide-react";
import {
  ProfileInfoCard,
  QuickStatsCard,
  OrdersTab,
  BookingsTab,
  EditProfileTab,
  DeleteModal,
} from "./profile";
import { useCustomerProfile } from "./profile/useCustomerProfile";

const MENU_ITEMS = [
  { id: "view", label: "Your Account", icon: User },
  { id: "orders", label: "Your Orders", icon: Package },
  { id: "bookings", label: "Your Classes", icon: Calendar },
  { id: "edit", label: "Account Settings", icon: Settings },
];

const CustomerProfile = () => {
  const {
    user,
    orders,
    activeTab,
    showDeleteModal,
    profileForm,
    passwordForm,
    upcomingBookings,
    totalBookings,
    isUserLoading,
    isLoadingOrders,
    isLoadingBookings,
    isChangingPassword,
    setActiveTab,
    setShowDeleteModal,
    handleInputChange,
    handlePasswordInputChange,
    handleUpdateProfile,
    handleChangePassword,
    handleDeleteAccount,
  } = useCustomerProfile();

  if (!user) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-4">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>Your Account</li>
          </ul>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6">Your Account</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-base-200 rounded-lg p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 border-b border-base-300 mb-4">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full">
                    <img
                      src={user.profileImage || "https://placehold.co/48x48"}
                      alt="Profile"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-xs text-base-content/60">{user.email}</p>
                </div>
              </div>

              {/* Menu */}
              <nav className="space-y-1">
                {MENU_ITEMS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === id
                        ? "bg-primary text-primary-content"
                        : "hover:bg-base-300"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      {label}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {activeTab === "view" && (
              <div className="space-y-6">
                <ProfileInfoCard user={user} setActiveTab={setActiveTab} />
                <QuickStatsCard
                  totalBookings={totalBookings}
                  totalOrders={orders.length}
                  isLoadingOrders={isLoadingOrders}
                  memberSince={user.createdAt}
                />
              </div>
            )}

            {activeTab === "orders" && (
              <OrdersTab orders={orders} isLoading={isLoadingOrders} />
            )}

            {activeTab === "bookings" && (
              <BookingsTab
                upcomingBookings={upcomingBookings}
                isLoading={isLoadingBookings}
              />
            )}

            {activeTab === "edit" && (
              <EditProfileTab
                profileForm={profileForm}
                passwordForm={passwordForm}
                handleInputChange={handleInputChange}
                handlePasswordInputChange={handlePasswordInputChange}
                handleUpdateProfile={handleUpdateProfile}
                handleChangePassword={handleChangePassword}
                setActiveTab={setActiveTab}
                setShowDeleteModal={setShowDeleteModal}
                isLoading={isUserLoading}
                isChangingPassword={isChangingPassword}
              />
            )}
          </main>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </div>
  );
};

export default CustomerProfile;
