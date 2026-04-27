import React, { useState } from 'react';
import { WifiOff, RefreshCw, CloudOff, Signal, Zap, ArrowLeft } from 'lucide-react';
import { useNetworkStatus } from '../../Context/NetworkStatusContext';
import { useNavigate } from 'react-router-dom';

const OfflinePage = () => {
  const { isOnline, isApiReachable, retryConnection } = useNetworkStatus();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const isDeviceOffline = !isOnline;

  const handleRetry = async () => {
    setIsRetrying(true);
    await retryConnection();
    setRetryCount(prev => prev + 1);
    setTimeout(() => setIsRetrying(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      <div className="relative z-10 text-center px-6 max-w-lg w-full">
        {/* Branding */}
        <div className="mb-12 flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
                <span className="text-yellow-500 font-black text-xl italic">X</span>
            </div>
            <span className="font-black uppercase tracking-tighter text-xl italic text-black">
                Xpress <span className="text-yellow-500">Autozone</span>
            </span>
        </div>

        {/* Icon Area */}
        <div className="relative inline-flex items-center justify-center mb-10">
          <div className="absolute w-32 h-32 rounded-full border border-yellow-500/10 animate-ping" />
          <div className={`relative w-24 h-24 rounded-none bg-black flex items-center justify-center shadow-2xl transform rotate-3`}>
            {isDeviceOffline ? (
              <WifiOff className="w-10 h-10 text-red-500" strokeWidth={1.5} />
            ) : (
              <CloudOff className="w-10 h-10 text-yellow-500" strokeWidth={1.5} />
            )}
          </div>
        </div>

        {/* Status Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-none text-[10px] font-black uppercase tracking-[0.2em] mb-6 border-l-4 border-yellow-500 text-black">
          {isDeviceOffline ? 'Network Disconnected' : 'Sync Interrupted'}
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-black text-black mb-6 uppercase italic tracking-tighter leading-none">
          {isDeviceOffline ? (
            <>Pardon the <span className="text-yellow-500 underline decoration-black decoration-4 underline-offset-4">Pit Stop</span></>
          ) : (
            <>Engine <span className="text-yellow-500 underline decoration-black decoration-4 underline-offset-4">Stalled</span></>
          )}
        </h1>

        {/* Message */}
        <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 font-bold uppercase tracking-tight">
          {isDeviceOffline ? (
            "We can't find your internet connection. Please check your data or Wi-Fi settings to continue shopping for genuine parts."
          ) : (
            "Our servers are taking a breather. We're working to get the inventory back online. Hang tight, we'll be back in the race shortly."
          )}
        </p>

        {/* Action Button */}
        <div className="flex flex-col gap-4">
            <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={`w-full py-5 bg-black text-white font-black uppercase italic tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all active:scale-95 ${
                isRetrying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-500 hover:text-black shadow-[10px_10px_0px_rgba(0,0,0,0.1)]'
            }`}
            >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Re-igniting...' : 'Retry Connection'}
            </button>
            
            <button 
                onClick={() => navigate('/')}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black flex items-center justify-center gap-2 mt-4"
            >
                <ArrowLeft size={12} /> Return Home
            </button>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
            <div className="flex gap-8">
                <div className="text-center">
                    <p className="text-[10px] font-black text-black uppercase">Status</p>
                    <p className="text-[10px] font-bold text-gray-400">{isDeviceOffline ? 'Offline' : 'Server Down'}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black text-black uppercase">Retries</p>
                    <p className="text-[10px] font-bold text-gray-400">{retryCount}</p>
                </div>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300">
                Official Xpress Marketplace
            </p>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;
