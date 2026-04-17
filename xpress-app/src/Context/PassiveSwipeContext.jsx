import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const PassiveSwipeContext = createContext();

export const PassiveSwipeProvider = ({ children }) => {
  const [visibleIds, setVisibleIds] = useState(new Set());
  const [activeId, setActiveId] = useState(null);

  // Use refs so the interval closure always reads current values without restarting
  const visibleIdsRef = useRef(new Set());
  const isManualActiveRef = useRef(false);
  const activeIdRef = useRef(null);

  // Keep refs in sync with state
  useEffect(() => {
    visibleIdsRef.current = visibleIds;
  }, [visibleIds]);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  // Register / Unregister visible cards
  const registerVisible = useCallback((id) => {
    setVisibleIds(prev => {
      if (prev.has(id)) return prev; // no-op if already registered
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const unregisterVisible = useCallback((id) => {
    setVisibleIds(prev => {
      if (!prev.has(id)) return prev; // no-op if not registered
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // Global manual override — just flip the ref, no state update needed
  const setManualStatus = useCallback((status) => {
    isManualActiveRef.current = status;
    // If releasing manual, immediately promote the next visible id
    if (!status) {
      const arr = Array.from(visibleIdsRef.current);
      if (arr.length > 0 && !arr.includes(activeIdRef.current)) {
        const next = arr[0];
        setActiveId(next);
        activeIdRef.current = next;
      }
    }
  }, []);

  // ONE stable interval — never restarts, reads current values from refs each tick
  useEffect(() => {
    const interval = setInterval(() => {
      // Skip this tick if user is manually interacting with any card
      if (isManualActiveRef.current) return;

      const arr = Array.from(visibleIdsRef.current);
      if (arr.length === 0) return;

      setActiveId(prev => {
        const idx = arr.indexOf(prev);
        const nextIdx = (idx + 1) % arr.length;
        return arr[nextIdx];
      });
    }, 3500); // 3.5s per card cycle

    return () => clearInterval(interval);
  }, []); // Empty deps — runs exactly once, stays alive forever

  return (
    <PassiveSwipeContext.Provider value={{
      activeId,
      registerVisible,
      unregisterVisible,
      setManualStatus,
    }}>
      {children}
    </PassiveSwipeContext.Provider>
  );
};

export const usePassiveSwipe = () => useContext(PassiveSwipeContext);
