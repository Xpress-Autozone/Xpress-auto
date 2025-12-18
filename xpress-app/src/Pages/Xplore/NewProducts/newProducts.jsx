import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ChevronLeft, TrendingUp } from "lucide-react";
import SkeletonLoader from "../../../Components/SkeletonLoader/skeletonLoader";

// Mock Data
const allProducts = [
    { id: 9, name: "Performance Exhaust", price: 299.99, image: "/api/placeholder/200/200", rating: 4.9, reviews: 180, category: "exhaust", tag: "editor" },
    { id: 10, name: "Smart Tire Monitor", price: 79.99, image: "/api/placeholder/200/200", rating: 4.6, reviews: 50, category: "electronics", tag: "new" },
];

const ProductCard = ({ product, navigate }) => (
    <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="group bg-white border border-gray-200 hover:border-black transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
    >
        {/* Flat Image Container */}
        <div className="relative h-64 overflow-hidden bg-gray-50 border-b border-gray-100">
            <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain p-6 transform group-hover:scale-105 transition-transform duration-700" 
            />
            {/* Signature Flat Badge */}
            <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-2">
                New Arrival
            </div>
            {/* Contextual Action */}
            <div className="absolute bottom-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button className="bg-black p-4 text-white hover:bg-yellow-500 hover:text-black transition-colors">
                    <ShoppingCart size={20} />
                </button>
            </div>
        </div>

        {/* Flat Content Section */}
        <div className="p-5 flex flex-col flex-1">
            <h3 className="font-black text-gray-900 uppercase tracking-tight line-clamp-2 text-sm mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                {product.name}
            </h3>
            
            <div className="flex items-center gap-1 mb-4">
                <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} strokeWidth={3} />
                    ))}
                </div>
                <span className="text-[10px] font-black text-gray-400">({product.reviews})</span>
            </div>

            <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-4">
                <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Price</span>
                    <span className="text-xl font-black italic text-black">GH₵{product.price.toFixed(2)}</span>
                </div>
                <div className="text-[9px] font-black uppercase px-2 py-1 border border-blue-500 text-blue-600 italic">
                    Just Added
                </div>
            </div>
        </div>
    </div>
);

export default function NewProducts() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const newProducts = allProducts.filter(p => p.tag === 'new' || p.tag === 'editor');

    if (isLoading) return <SkeletonLoader />;

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header / Editorial Area */}
            <div className="bg-gray-50 border-b border-gray-100 pt-32 pb-16 mb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <button
                        onClick={() => navigate("/xplore")}
                        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black mb-8 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Return to Xplore
                    </button>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs">Latest Inventory</span>
                            <h1 className="text-4xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-none">
                                New <br/> <span className="text-gray-300">Arrivals</span>
                            </h1>
                        </div>
                        <p className="text-gray-500 font-medium max-w-sm border-l-2 border-blue-600 pl-4 text-sm leading-relaxed">
                            Fresh components just added to our verified catalog. Be the first to upgrade your vehicle with our latest performance parts.
                        </p>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-6">
                {newProducts.length === 0 ? (
                    <div className="text-center py-32 border-2 border-dashed border-gray-100">
                        <p className="font-black uppercase tracking-widest text-gray-400">Checking for fresh arrivals...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {newProducts.map(product => (
                            <ProductCard key={product.id} product={product} navigate={navigate} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}