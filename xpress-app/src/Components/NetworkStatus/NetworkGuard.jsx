import React from 'react';
import { useNetworkStatus } from '../../Context/NetworkStatusContext';
import OfflinePage from './OfflinePage';
import NetworkStatusBanner from './NetworkStatusBanner';

const NetworkGuard = ({ children }) => {
  const { isFullyConnected } = useNetworkStatus();

  return (
    <>
      <NetworkStatusBanner />
      {isFullyConnected ? children : <OfflinePage />}
    </>
  );
};

export default NetworkGuard;
