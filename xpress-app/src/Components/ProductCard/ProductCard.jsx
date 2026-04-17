import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "../../Context/CartContext";
import { usePassiveSwipe } from "../../Context/PassiveSwipeContext";

/**
 * UniversalProductCard Component
 *
 * Modes:
 * A) Multi-image product → swipe left/right to cycle through images.
 * B) Single-image product → Ken Burns zoom animation plays when this card
 *    is the passive "active" card or when the user interacts with the image.
 *
 * Swipe handlers are scoped to the IMAGE AREA only (not the full card),
 * so tapping the name/price/button still works as a normal click.
 */
export default function ProductCard({ product, variant = "default", badge }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { activeId, registerVisible, unregisterVisible, setManualStatus } = usePassiveSwipe();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageActive, setIsImageActive] = useState(false); // true when user touches/hovers image area

  const cardRef = useRef(null);

  // Refs for zero-stale-closure touch tracking
  const startXRef = useRef(0);
  const swipedRef = useRef(false);
  const isImageActiveRef = useRef(false);

  // Build deduplicated image list
  const imageSources = Array.from(new Set([
    product.image,
    ...(product.additionalImages || [])
      .map(img => (typeof img === 'string' ? img : img.url || img.imageUrl))
      .filter(img => img && typeof img === 'string' && img.startsWith('http'))
  ])).filter(Boolean);

  const imageSourcesRef = useRef(imageSources);
  useEffect(() => { imageSourcesRef.current = imageSources; }, [imageSources.join(',')]);

  const hasMultipleImages = imageSources.length > 1;

  // Track card visibility for the passive context
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) registerVisible(product.id);
        else unregisterVisible(product.id);
      },
      { threshold: 0.15 } // Generous threshold for mobile
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [product.id, registerVisible, unregisterVisible]);

  // This card is the passive "spotlight" card
  const isPassiveActive = activeId === product.id;

  // The card is "engaged" (passive spotlight OR user touching image area)
  const isEngaged = isPassiveActive || isImageActive;

  // ── Auto-cycle interval (multi-image only) ─────────────────────────────────
  useEffect(() => {
    if (!hasMultipleImages) return; // Ken Burns handles single-image — no interval needed
    if (!isEngaged) {
      setCurrentImageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % imageSourcesRef.current.length);
    }, isImageActive ? 1000 : 3000);
    return () => clearInterval(interval);
  }, [isEngaged, isImageActive, hasMultipleImages]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const handleCardClick = () => {
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      status: product.status,
    });
  };

  // ── Image-area pointer handlers (Manual Swipe) ─────────────────────────────
  const onImagePointerDown = useCallback((e) => {
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    startXRef.current = e.clientX;
    swipedRef.current = false;
    isImageActiveRef.current = true;
    setIsImageActive(true);
    setManualStatus(true);
  }, [setManualStatus]);

  const onImagePointerMove = useCallback((e) => {
    if (!isImageActiveRef.current) return;
    const sources = imageSourcesRef.current;
    if (sources.length <= 1) return; // Ken Burns handles single-image case

    const delta = e.clientX - startXRef.current;
    if (Math.abs(delta) > 32) {
      setCurrentImageIndex(prev =>
        delta > 0
          ? (prev - 1 + sources.length) % sources.length   // swipe right → prev
          : (prev + 1) % sources.length                     // swipe left  → next
      );
      startXRef.current = e.clientX; // reset for chained swipes
      swipedRef.current = true;
    }
  }, []);

  const onImagePointerUp = useCallback((e) => {
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
    isImageActiveRef.current = false;
    setIsImageActive(false);
    setManualStatus(false);
  }, [setManualStatus]);

  const onImagePointerEnter = useCallback((e) => {
    if (e.pointerType === 'mouse') {
      isImageActiveRef.current = true;
      setIsImageActive(true);
      setManualStatus(true);
      swipedRef.current = false;
    }
  }, [setManualStatus]);

  // ── Styling ────────────────────────────────────────────────────────────────
  const cardClasses = variant === "featured"
    ? "bg-white border border-gray-100 hover:border-black transition-all cursor-pointer group text-left flex flex-col h-full select-none"
    : "group cursor-pointer flex flex-col h-full select-none";

  const imageAreaClasses = `relative bg-gray-50 flex items-center justify-center border-b border-gray-50 overflow-hidden touch-pan-y ${
    variant === 'featured' ? 'aspect-[4/5]' : 'aspect-square mb-4'
  }`;

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className={cardClasses}
    >
      {/* ── IMAGE AREA — swipe handlers scoped here only ─────────────────── */}
      <div
        className={imageAreaClasses}
        onPointerDown={onImagePointerDown}
        onPointerMove={onImagePointerMove}
        onPointerUp={onImagePointerUp}
        onPointerLeave={onImagePointerUp}
        onPointerCancel={onImagePointerUp}
        onPointerEnter={onImagePointerEnter}
      >
        {imageSources.length > 0 ? (
          <div className="relative w-full h-full overflow-hidden">
            {hasMultipleImages ? (
              // Multi-image: fade between images
              imageSources.map((src, idx) => (
                <img
                  key={`${product.id}-${idx}`}
                  src={src}
                  alt={`${product.name} — view ${idx + 1}`}
                  draggable={false}
                  className={`absolute inset-0 w-full h-full object-contain mix-blend-multiply transition-opacity duration-500 ${
                    idx === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              ))
            ) : (
              // Single-image: Ken Burns zoom when engaged
              <img
                src={imageSources[0]}
                alt={product.name}
                draggable={false}
                className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-300 ${
                  isEngaged ? "animate-ken-burns" : ""
                }`}
                loading="eager"
              />
            )}
          </div>
        ) : (
          <div className="text-gray-300 font-black uppercase tracking-widest text-xs italic">No Visual</div>
        )}

        {/* Badge */}
        {(badge || product.featured) && (
          <div className={`absolute top-0 left-0 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 z-10 ${
            badge === 'Matching' ? 'bg-yellow-500 text-black' :
            badge === 'Hot'      ? 'bg-red-600 text-white' :
            badge === 'New'      ? 'bg-black text-white' :
                                   'bg-yellow-500 text-black'
          }`}>
            {badge || (product.featured ? 'Featured' : '')}
          </div>
        )}

        {/* Image dots — visible when multiple images exist */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {imageSources.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentImageIndex ? "bg-black w-3" : "bg-black/25 w-1"
                }`}
              />
            ))}
          </div>
        )}

        {/* Single-image zoom indicator */}
        {!hasMultipleImages && isEngaged && (
          <div className="absolute bottom-2 right-2 z-20 text-[8px] font-black uppercase tracking-widest text-black/40">
            ✦ zoom
          </div>
        )}
      </div>

      {/* ── CARD INFO ─────────────────────────────────────────────────────── */}
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
            <span className="text-lg md:text-xl font-black italic tracking-tighter">
              GH₵{product.price.toFixed(2)}
            </span>
            <div className={`text-[9px] font-black uppercase px-2 py-0.5 w-fit border ${
              product.status === "In Stock"
                ? "border-green-500 text-green-600"
                : "border-red-500 text-red-600"
            }`}>
              {product.status}
            </div>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-yellow-500 hover:bg-black hover:text-white text-black font-black py-2.5 text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add To Cart
        </button>
      </div>
    </div>
  );
}
