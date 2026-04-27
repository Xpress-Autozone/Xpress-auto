import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// For Xpress-auto, the API URL is defined in productService.js, but we'll use a standard ping
const API_BASE_URL = "https://xpress-backend-eeea.onrender.com";

const NetworkStatusContext = createContext();

export function useNetworkStatus() {
  const context = useContext(NetworkStatusContext);
  if (!context) {
    throw new Error('useNetworkStatus must be used within a NetworkStatusProvider');
  }
  return context;
}

export function NetworkStatusProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isApiReachable, setIsApiReachable] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const checkIntervalRef = useRef(null);

  // Lightweight ping to verify API reachability
  const checkApiHealth = useCallback(async () => {
    if (!navigator.onLine) {
      setIsApiReachable(false);
      return false;
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      // Pinging a safe endpoint
      const response = await fetch(`${API_BASE_URL}/products?limit=1`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const reachable = response.ok || response.status === 401 || response.status === 403;
      setIsApiReachable(reachable);
      return reachable;
    } catch {
      setIsApiReachable(false);
      return false;
    }
  }, []);

  // Handle browser online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkApiHealth().then((reachable) => {
        if (reachable && wasOffline) {
          setShowReconnected(true);
          setWasOffline(false);
          setTimeout(() => setShowReconnected(false), 4000);
        }
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsApiReachable(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkApiHealth, wasOffline]);

  // Periodic API health check
  useEffect(() => {
    const interval = (!isOnline || !isApiReachable) ? 15000 : 60000;

    checkIntervalRef.current = setInterval(() => {
      checkApiHealth();
    }, interval);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [isOnline, isApiReachable, checkApiHealth]);

  useEffect(() => {
    checkApiHealth();
  }, [checkApiHealth]);

  useEffect(() => {
    if (!isOnline || !isApiReachable) {
      setWasOffline(true);
    }
  }, [isOnline, isApiReachable]);

  const dismissReconnected = useCallback(() => {
    setShowReconnected(false);
  }, []);

  const retryConnection = useCallback(async () => {
    const result = await checkApiHealth();
    if (result && wasOffline) {
      setShowReconnected(true);
      setWasOffline(false);
      setTimeout(() => setShowReconnected(false), 4000);
    }
    return result;
  }, [checkApiHealth, wasOffline]);

  const value = {
    isOnline,
    isApiReachable,
    isFullyConnected: isOnline && isApiReachable,
    showReconnected,
    dismissReconnected,
    retryConnection,
  };

  return (
    <NetworkStatusContext.Provider value={value}>
      {children}
    </NetworkStatusContext.Provider>
  );
}
