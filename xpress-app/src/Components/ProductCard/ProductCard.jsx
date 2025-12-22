import React from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

export default function ProductCard({ product, variant = "default" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log(`[ProductCard] 🔗 Navigating to product: ${product.id} - ${product.name}`);
    navigate(`/product/${product.id}`, { state: { product } });
  };

  if (variant === "featured") {
    return (
      <div
        onClick={handleClick}
        className="bg-white border border-gray-100 hover:border-black transition-all cursor-pointer group text-left"
      >
        <div className="aspect-[4/5] bg-gray-50 flex items-center justify-center p-6 border-b border-gray-50 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="text-gray-300 font-black uppercase tracking-widest text-xs">Image</div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-xs md:text-sm text-gray-900 uppercase tracking-tight mb-2 line-clamp-2 h-10">
            {product.name}
          </h3>
          {product.verified && (
            <div className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase mb-3">
              <Check className="w-3 h-3" />
              <span>Verified</span>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <span className="text-xl font-black italic">GH₵{product.price.toFixed(2)}</span>
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 w-fit border ${
                product.status === "In Stock"
                  ? "border-green-500 text-green-600"
                  : "border-orange-500 text-orange-600"
              }`}
            >
              {product.status}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default variant for category pages
  return (
    <div onClick={handleClick} className="group cursor-pointer">
      <div className="aspect-[4/5] bg-gray-50 mb-4 overflow-hidden relative border border-gray-50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 font-black uppercase tracking-widest text-xs">
            Image
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-xs md:text-sm font-black text-gray-900 uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex flex-col gap-1 pt-1">
          <span className="text-lg font-black italic tracking-tighter text-black">
            GH₵{product.price.toFixed(2)}
          </span>
          <div
            className={`text-[9px] font-black uppercase w-fit px-2 py-0.5 border ${
              product.status === "In Stock"
                ? "border-green-500 text-green-600"
                : "border-red-500 text-red-600"
            }`}
          >
            {product.status}
          </div>
        </div>
      </div>
    </div>
  );
}
