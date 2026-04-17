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

  // Combine images into a stable array
  const imageSources = [
    product.image,
    ...(product.additionalImages || [])
      .map(img => (typeof img === 'string' ? img : img.url || img.imageUrl))
      .filter(img => img && img.startsWith('http'))
  ];

  // Passively track visibility 
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) registerVisible(product.id);
        else unregisterVisible(product.id);
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [product.id, registerVisible, unregisterVisible]);

  // Combined Swipe Logic
  const isActuallySwiping = isManualActive || (activeId === product.id);

  useEffect(() => {
    let interval;
    if (isActuallySwiping && imageSources.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % imageSources.length);
      }, isManualActive ? 1200 : 3000); // Passive is 3s, Manual is 1.2s
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isActuallySwiping, imageSources.length, isManualActive]);

  const handleClick = () => {
    navigate(`/product/${product.id}`, { state: { product } });
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

  // Interaction handlers
  const startManual = (e) => {
    if (e.pointerType === 'touch') e.currentTarget.setPointerCapture(e.pointerId);
    setIsManualActive(true);
    setManualStatus(true);
  };

  const stopManual = (e) => {
    if (e.pointerType === 'touch') e.currentTarget.releasePointerCapture(e.pointerId);
    setIsManualActive(false);
    setManualStatus(false);
  };

  const cardClasses = variant === "featured" 
    ? "bg-white border border-gray-100 hover:border-black transition-all cursor-pointer group text-left flex flex-col h-full"
    : "group cursor-pointer flex flex-col h-full";

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={cardClasses}
      onPointerDown={startManual}
      onPointerUp={stopManual}
      onPointerEnter={() => { setIsManualActive(true); setManualStatus(true); }}
      onPointerLeave={stopManual}
      onPointerCancel={stopManual}
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
