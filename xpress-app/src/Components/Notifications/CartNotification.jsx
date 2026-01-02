import React, { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

export default function CartNotification({ message = "Added to cart!", duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4">
      <CheckCircle className="w-5 h-5" />
      <span className="font-semibold text-sm">{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-2 hover:bg-green-600 p-1 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
