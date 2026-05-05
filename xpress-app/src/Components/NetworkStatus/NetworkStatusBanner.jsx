import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useNetworkStatus } from '../../Context/NetworkStatusContext';

const NetworkStatusBanner = () => {
  const { showReconnected, dismissReconnected, isWakingUp } = useNetworkStatus();

  if (showReconnected) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[10000] animate-in slide-in-from-top duration-500">
        <div className="bg-yellow-500 text-black px-6 py-3 flex items-center justify-between border-b-2 border-black shadow-2xl">
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

  if (isWakingUp) {
    return (
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[10000] animate-in zoom-in-95 duration-500">
        <div className="bg-black/90 backdrop-blur-md text-white px-5 py-3 flex items-center gap-4 rounded-full border border-white/10 shadow-2xl">
          <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">Waking up Xpress Engine...</span>
        </div>
      </div>
    );
  }

  return null;
};

export default NetworkStatusBanner;
