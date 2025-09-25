import { userStore } from '../../storeData/userStore';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, requiresTrainerSetup = false }) => {
    const { user, isCheckingAuth, needsTrainerSetup } = userStore();
    const location = useLocation();

    // Show loading while checking auth
    if (isCheckingAuth) {
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

    // Special handling for trainer setup
    if (user && user.role === 'trainer') {
        const needsSetup = needsTrainerSetup();
        
        // If on trainer-setup page but already has profile
        if (location.pathname === '/trainer-setup' && !needsSetup) {
            return <Navigate to="/trainerdashboard" replace />;
        }
        
        // If trying to access trainer dashboard but needs setup
        if (location.pathname === '/trainerdashboard' && needsSetup) {
            return <Navigate to="/trainer-setup" replace />;
        }
    }

    // If user role is not allowed, show access denied
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body text-center">
                        <h2 className="card-title justify-center text-error">Access Denied</h2>
                        <p>You don't have permission to access this page.</p>
                        <div className="card-actions justify-center">
                            <button onClick={() => window.history.back()} className="btn btn-primary">
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;