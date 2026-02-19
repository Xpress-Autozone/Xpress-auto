import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isOnboarded } = useSelector((state) => state.user);
    const location = useLocation();

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
