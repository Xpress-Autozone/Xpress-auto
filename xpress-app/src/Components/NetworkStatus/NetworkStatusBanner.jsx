import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useNetworkStatus } from '../../Context/NetworkStatusContext';

const NetworkStatusBanner = () => {
  const { showReconnected, dismissReconnected } = useNetworkStatus();

  if (showReconnected) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[10000] animate-in slide-in-from-top duration-500">
        <div className="bg-yellow-500 text-black px-6 py-3 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Connection Restored — Back in the race</span>
          </div>
          <button
            onClick={dismissReconnected}
            className="p-1 hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default NetworkStatusBanner;
