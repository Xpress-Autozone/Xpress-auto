import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ShoppingCart, Sparkles } from "lucide-react";
import { useCart } from "../../Context/CartContext";
import { usePassiveSwipe } from "../../Context/PassiveSwipeContext";

/**
 * UniversalProductCard Component
 * Features:
 * - Passively auto-swipes images for visible products (one at a time globally).
 * - Interactive auto-swipes on hover/touch (overrides passive).
 * - High-perf layered image rendering for zero-latency mobile swiping.
 */
export default function ProductCard({ product, variant = "default", badge }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { activeId, registerVisible, unregisterVisible, setManualStatus } = usePassiveSwipe();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isManualActive, setIsManualActive] = useState(false);
  const cardRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [swipePerformed, setSwipePerformed] = useState(false);

  // Combine images into a stable, deduplicated array
  const imageSources = Array.from(new Set([
    product.image,
    ...(product.additionalImages || [])
      .map(img => (typeof img === 'string' ? img : img.url || img.imageUrl))
      .filter(img => img && img.startsWith('http'))
  ])).filter(Boolean);

  // Passively track visibility with a lower threshold for mobile
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) registerVisible(product.id);
        else unregisterVisible(product.id);
      },
      { threshold: 0.2 } // Lower threshold for better mobile detection
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [product.id, registerVisible, unregisterVisible]);

  // Combined Swipe Logic
  const isActuallySwiping = isManualActive || (activeId === product.id);

  useEffect(() => {
    let interval;
    if (isActuallySwiping && imageSources.length > 1 && !swipePerformed) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % imageSources.length);
      }, isManualActive ? 1200 : 3000); // Passive is 3s, Manual is 1.2s
    } else {
      setCurrentImageIndex(prev => (swipePerformed ? prev : 0));
    }
    return () => clearInterval(interval);
  }, [isActuallySwiping, imageSources.length, isManualActive, swipePerformed]);

  const handleClick = (e) => {
    // Only navigate if we didn't just perform a manual swipe
    if (!swipePerformed) {
      navigate(`/product/${product.id}`, { state: { product } });
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      status: product.status
    });
  };

  // Interaction handlers - optimized for mobile + manual gestures
  const startManual = (e) => {
    if (e.pointerType === 'touch') {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    setStartX(e.clientX);
    setSwipePerformed(false);
    setIsManualActive(true);
    setManualStatus(true);
  };

  const handlePointerMove = (e) => {
    if (!isManualActive || imageSources.length <= 1) return;

    const deltaX = e.clientX - startX;
    const threshold = 40; // 40px movement to trigger a swipe

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        // Swipe Right (Prev)
        setCurrentImageIndex(prev => (prev - 1 + imageSources.length) % imageSources.length);
      } else {
        // Swipe Left (Next)
        setCurrentImageIndex(prev => (prev + 1) % imageSources.length);
      }
      setStartX(e.clientX); // Reset start point for chained swipes
      setSwipePerformed(true); // Mark as swiped to block navigation
    }
  };

  const stopManual = (e) => {
    if (e.pointerType === 'touch') {
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(err) {}
    }
    setIsManualActive(false);
    setManualStatus(false);
    // Note: swipePerformed is kept true until the next pointerDown or click resolves
  };

  const cardClasses = variant === "featured" 
    ? "bg-white border border-gray-100 hover:border-black transition-all cursor-pointer group text-left flex flex-col h-full touch-pan-y"
    : "group cursor-pointer flex flex-col h-full touch-pan-y";

  return (
    <div
      ref={cardRef}
      onPointerDown={startManual}
      onPointerMove={handlePointerMove}
      onPointerUp={stopManual}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') {
          setIsManualActive(true);
          setManualStatus(true);
          setSwipePerformed(false);
        }
      }}
      onPointerLeave={stopManual}
      onPointerCancel={stopManual}
      onClick={handleClick}
      className={cardClasses}
    >
      <div className={`relative bg-gray-50 flex items-center justify-center border-b border-gray-50 overflow-hidden ${variant === 'featured' ? 'aspect-[4/5]' : 'aspect-square mb-4'}`}>
        {imageSources.length > 0 ? (
          <div className="relative w-full h-full">
            {imageSources.map((src, idx) => (
              <img
                key={`${src}-${idx}`}
                src={src}
                alt={`${product.name} view ${idx}`}
                className={`absolute inset-0 w-full h-full object-contain mix-blend-multiply transition-all duration-700 ${
                  idx === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
                } ${isActuallySwiping && idx === currentImageIndex ? "scale-105" : ""}`}
                loading={idx === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-300 font-black uppercase tracking-widest text-xs italic">No Visual</div>
        )}

        {/* Badges Overlay */}
        {(badge || product.featured) && (
            <div className={`absolute top-0 left-0 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 z-10 ${
                badge === 'Matching' ? 'bg-yellow-500 text-black' : 
                badge === 'Hot' ? 'bg-red-600' : 
                badge === 'New' ? 'bg-black' : 'bg-yellow-500 text-black'
            }`}>
              {badge || (product.featured ? 'Featured' : '')}
            </div>
        )}

        {/* Multi-image indicator dots */}
        {isActuallySwiping && imageSources.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                {imageSources.map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-1 h-1 rounded-full transition-all ${i === currentImageIndex ? "bg-black w-2" : "bg-black/20"}`}
                    />
                ))}
            </div>
        )}
      </div>

      <div className={`${variant === 'featured' ? 'p-4' : 'space-y-2'} flex flex-col flex-1`}>
        <h3 className="font-black text-xs md:text-sm text-gray-900 uppercase tracking-tight mb-2 line-clamp-2 h-10 leading-tight">
          {product.name}
        </h3>

        {product.verified && variant === 'featured' && (
          <div className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase mb-3 italic">
            <Check className="w-3 h-3" />
            <span>Xpress Verified</span>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-1 mb-3 pt-4 border-t border-gray-50">
          <div className="flex items-end justify-between">
            <span className="text-lg md:text-xl font-black italic tracking-tighter">GH₵{product.price.toFixed(2)}</span>
            <div className={`text-[9px] font-black uppercase px-2 py-0.5 w-fit border ${
                product.status === "In Stock" ? "border-green-500 text-green-600" : "border-red-500 text-red-600"
              }`}>
              {product.status}
            </div>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-yellow-500 hover:bg-black hover:text-white text-black font-black py-2.5 text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 group-hover:scale-105 active:scale-95 shadow-sm"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add To Cart
        </button>
      </div>
    </div>
  );
}
