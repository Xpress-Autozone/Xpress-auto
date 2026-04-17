import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PassiveSwipeContext = createContext();

export const PassiveSwipeProvider = ({ children }) => {
  const [visibleIds, setVisibleIds] = useState(new Set());
  const [activeId, setActiveId] = useState(null);
  const [isAnyManualActive, setIsAnyManualActive] = useState(false);
  
  const rotationInterval = useRef(null);

  // Register / Unregister visible cards
  const registerVisible = (id) => {
    setVisibleIds(prev => new Set(prev).add(id));
  };

  const unregisterVisible = (id) => {
    setVisibleIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Global manual override (if user is hovering anywhere, stop passive rotation)
  const setManualStatus = (status) => setIsAnyManualActive(status);

  // Logic: Rotate the active swiper among visible cards
  useEffect(() => {
    if (visibleIds.size === 0 || isAnyManualActive) {
      if (rotationInterval.current) clearInterval(rotationInterval.current);
      setActiveId(null);
      return;
    }

    // Immediately pick one if none active
    const idsArray = Array.from(visibleIds);
    if (!activeId || !visibleIds.has(activeId)) {
        setActiveId(idsArray[0]);
    }

    rotationInterval.current = setInterval(() => {
      setVisibleIds(currentVisible => {
        const visibleArray = Array.from(currentVisible);
        if (visibleArray.length === 0) return currentVisible;
        
        setActiveId(prevActive => {
          const currentIndex = visibleArray.indexOf(prevActive);
          const nextIndex = (currentIndex + 1) % visibleArray.length;
          return visibleArray[nextIndex];
        });
        
        return currentVisible;
      });
    }, 4000); // 4 seconds per passive swipe

    return () => {
      if (rotationInterval.current) clearInterval(rotationInterval.current);
    };
  }, [visibleIds.size, isAnyManualActive]);

  return (
    <PassiveSwipeContext.Provider value={{ 
        activeId, 
        registerVisible, 
        unregisterVisible, 
        setManualStatus,
        isAnyManualActive 
    }}>
      {children}
    </PassiveSwipeContext.Provider>
  );
};

export const usePassiveSwipe = () => useContext(PassiveSwipeContext);
