import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isOnboarded, isAuthInitialized } = useSelector((state) => state.user);
    const location = useLocation();

    // If we haven't checked Firebase auth state yet, wait.
    if (!isAuthInitialized) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] w-full">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Verifying Session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login but save the current location to redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // STRICT: If authenticated but not onboarded, FORCE to onboarding
    // unless we are already ON the onboarding page.
    if (!isOnboarded && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    if (isOnboarded && location.pathname === '/onboarding') {
        // Already onboarded, don't show onboarding page again
        return <Navigate to="/account" replace />;
    }

    return children;
};

export default ProtectedRoute;
