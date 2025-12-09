import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ChevronLeft, Flame } from "lucide-react";
import SkeletonLoader from "../../../Components/SkeletonLoader/skeletonLoader";

const allProducts = [
    { id: 1, name: "Premium Brake Pads", price: 99.99, image: "/api/placeholder/300/300", rating: 4.8, reviews: 250, category: "brakes", tag: "featured" },
    { id: 2, name: "LED Headlights", price: 149.99, image: "/api/placeholder/300/300", rating: 4.9, reviews: 320, category: "lighting", tag: "featured" },
    { id: 3, name: "All-Season Tires", price: 129.99, image: "/api/placeholder/300/300", rating: 4.7, reviews: 180, category: "tires", tag: "featured" },
    { id: 4, name: "Air Filter", price: 29.99, image: "/api/placeholder/200/200", rating: 4.5, reviews: 120, category: "engine" },
    { id: 5, name: "Oil Filter", price: 19.99, image: "/api/placeholder/200/200", rating: 4.7, reviews: 98, category: "engine" },
    { id: 6, name: "Shock Absorber", price: 89.99, image: "/api/placeholder/200/200", rating: 4.8, reviews: 150, category: "suspension" },
    { id: 7, name: "Brake Pads", price: 49.99, image: "/api/placeholder/200/200", rating: 4.7, reviews: 300, category: "brakes", tag: "popular" },
    { id: 8, name: "Car Battery", price: 129.99, image: "/api/placeholder/200/200", rating: 4.8, reviews: 250, category: "electrical", tag: "popular" },
];

const ProductCard = ({ product, navigate }) => (
    <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex flex-col h-full"
    >
        <div className="relative h-48 overflow-hidden bg-gray-100">
            <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm bg-red-500">
                Hot
            </div>
            <div className="absolute bottom-3 right-3 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                <button className="bg-white p-2 rounded-full shadow-lg hover:bg-yellow-400 text-gray-800 transition-colors">
                    <ShoppingCart size={20} />
                </button>
            </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
            <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-yellow-600 transition-colors">
                {product.name}
            </h3>
            
            <div className="flex items-center gap-1 mt-1 mb-3">
                <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-300"} />
                    ))}
                </div>
                <span className="text-xs text-gray-400">({product.reviews})</span>
            </div>

            <div className="mt-auto flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">${product.price}</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">In Stock</span>
            </div>
        </div>
    </div>
);

export default function TrendingProducts() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const trendingProducts = allProducts.filter(p => p.tag === 'popular' || p.reviews > 150);

    if (isLoading) return <SkeletonLoader />;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate("/xplore")}
                        className="flex items-center gap-2 text-yellow-500 hover:text-yellow-600 mb-6 font-medium"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Xplore
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                        <Flame className="text-red-500" />
                        Hot Right Now
                    </h1>
                    <p className="text-gray-600 text-lg">Trending products everyone is talking about</p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trendingProducts.map(product => (
                        <ProductCard key={product.id} product={product} navigate={navigate} />
                    ))}
                </div>

                {trendingProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No trending products at the moment</p>
                    </div>
                )}
            </div>
        </div>
    );
}
