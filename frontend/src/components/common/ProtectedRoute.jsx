import { userStore } from "../../storeData/userStore";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({
  children,
  allowedRoles,
  requiresTrainerSetup = false,
}) => {
  const {
    user,
    isCheckingAuth,
    isLoading,
    isAuthenticated,
    needsTrainerSetup,
  } = userStore();
  const location = useLocation();

  // Show loading while checking auth or during login/logout
  if (isCheckingAuth || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wait for user data to be fully loaded before checking roles
  // This prevents "Access Denied" flash during login transition
  if (!user.role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Special handling for trainer setup
  if (user && user.role === "trainer") {
    const needsSetup = needsTrainerSetup();

    // If on trainer-setup page but already has profile
    if (location.pathname === "/trainer-setup" && !needsSetup) {
      return <Navigate to="/trainerdashboard" replace />;
    }

    // If trying to access trainer dashboard but needs setup
    if (location.pathname === "/trainerdashboard" && needsSetup) {
      return <Navigate to="/trainer-setup" replace />;
    }
  }

  // If user role is not allowed, redirect to appropriate page instead of showing error
  // This prevents flash of "Access Denied" during login transition
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    // Redirect based on user's actual role
    if (user.role === "admin") {
      return <Navigate to="/admindashboard" replace />;
    } else if (user.role === "trainer") {
      return <Navigate to="/trainerdashboard" replace />;
    } else {
      return <Navigate to="/profile" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
