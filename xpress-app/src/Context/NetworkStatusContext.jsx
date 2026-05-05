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
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const checkIntervalRef = useRef(null);
  const failureCountRef = useRef(0);

  // Lightweight ping to verify API reachability
  const checkApiHealth = useCallback(async (retryCount = 3) => {
    if (!navigator.onLine) {
      setIsApiReachable(false);
      return false;
    }

    const attempt = async (count) => {
      try {
        const controller = new AbortController();
        // Increase timeout to 30s for Render cold starts
        const timeout = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          signal: controller.signal,
        });
        clearTimeout(timeout);
        
        // Any response from our server (even 4xx) means the server is reachable
        const reachable = response.status >= 200 && response.status < 500;
        if (reachable) {
          setIsApiReachable(true);
          setIsWakingUp(false);
          failureCountRef.current = 0;
          return true;
        }
        throw new Error("Unreachable");
      } catch (err) {
        if (err.name === 'AbortError') {
          setIsWakingUp(true); // Server might be starting
        }

        if (count > 1) {
          // Wait 3s before retrying
          await new Promise(r => setTimeout(r, 3000));
          return attempt(count - 1);
        }

        failureCountRef.current += 1;
        
        // Only block UI if we've failed multiple full retry cycles in background
        if (failureCountRef.current > 2) {
          setIsApiReachable(false);
          setIsWakingUp(false);
        }
        return false;
      }
    };

    return attempt(retryCount);
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
    isWakingUp,
    isFullyConnected: isOnline && (isApiReachable || isWakingUp),
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
