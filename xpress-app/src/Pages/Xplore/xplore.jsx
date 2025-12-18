import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star, 
  Flame, 
  Sparkles, 
  Car, 
  ShoppingCart,
  Settings,
  Zap,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import SkeletonLoader from "../../Components/SkeletonLoader/skeletonLoader";
import productsSrip from "../../assets/productsStrip.jpg";

// --- MOCK DATA ---
const categories = [
    { 
        name: "Body & Parts", 
        id: "body-chassis", 
        icon: <img src="/assets/icons/parts.png" alt="Body & Parts" className="w-8 h-8 mx-auto" /> 
    },
    { 
        name: "Engine & Performance", 
        id: "engine-performance", 
        icon: <img src="/assets/icons/engine.png" alt="Engine & Performance" className="w-10 h-8 mx-auto" /> 
    },
    { 
        name: "Lighting & Electronics", 
        id: "lighting-electronics", 
        icon: <img src="/assets/icons/battery.png" alt="Lighting & Electronics" className="w-10 h-8 mx-auto" /> 
    },
    { 
        name: "Accessories", 
        id: "accessories", 
        icon: <img src="/assets/icons/steer.png" alt="Accessories" className="w-8 h-8 mx-auto" /> 
    }
];

const allProducts = [
    { id: 1, name: "Premium Brake Pads", price: 99.99, image: "/api/placeholder/300/300", rating: 4.8, reviews: 250, category: "brakes", tag: "featured" },
    { id: 2, name: "LED Headlights", price: 149.99, image: "/api/placeholder/300/300", rating: 4.9, reviews: 320, category: "lighting", tag: "featured" },
    { id: 3, name: "All-Season Tires", price: 129.99, image: "/api/placeholder/300/300", rating: 4.7, reviews: 180, category: "tires", tag: "featured" },
    { id: 7, name: "Brake Pads", price: 49.99, image: "/api/placeholder/200/200", rating: 4.7, reviews: 300, category: "brakes", tag: "popular" },
    { id: 8, name: "Car Battery", price: 129.99, image: "/api/placeholder/200/200", rating: 4.8, reviews: 250, category: "electrical", tag: "popular" },
    { id: 9, name: "Performance Exhaust", price: 299.99, image: "/api/placeholder/200/200", rating: 4.9, reviews: 180, category: "exhaust", tag: "editor" },
    { id: 10, name: "Smart Tire Monitor", price: 79.99, image: "/api/placeholder/200/200", rating: 4.6, reviews: 50, category: "electronics", tag: "new" },
];

// --- REUSABLE COMPONENTS ---

const ProductCard = ({ product, navigate, badge }) => (
    <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="group bg-white border border-gray-200 hover:border-black transition-colors duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
    >
        <div className="relative h-56 overflow-hidden bg-gray-50 border-b border-gray-100">
            <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain p-4 transform group-hover:scale-105 transition-transform duration-500" 
            />
            {badge && (
                <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5">
                    {badge}
                </div>
            )}
        </div>

        <div className="p-4 flex flex-col flex-1">
            <h3 className="font-bold text-gray-900 uppercase tracking-tight line-clamp-1 text-sm mb-1">
                {product.name}
            </h3>
            
            <div className="flex items-center gap-1 mb-3">
                <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                    ))}
                </div>
                <span className="text-[10px] font-bold text-gray-400">({product.reviews})</span>
            </div>

            <div className="mt-auto flex items-end justify-between">
                <div>
                    <span className="text-xs text-gray-400 block font-bold uppercase tracking-tighter">Price</span>
                    <span className="text-lg font-black text-black">GH₵{product.price}</span>
                </div>
                <button className="bg-gray-100 p-2 hover:bg-black hover:text-white transition-colors">
                    <ShoppingCart size={18} />
                </button>
            </div>
        </div>
    </div>
);

export default function XplorePage() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <SkeletonLoader />;

    return (
        <main className="min-h-screen bg-white pb-20">
            
            {/* HERO SECTION - FLAT DESIGN */}
            <section className="relative h-[450px] w-full bg-black overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: `url(${productsSrip})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center text-white">
                    <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-xs mb-4">Quality Guaranteed</span>
                    <h1 className="text-5xl md:text-8xl font-black mb-6 leading-[0.9] uppercase italic tracking-tighter">
                        UPGRADE <br/>YOUR RIDE
                    </h1>
                    <p className="text-base md:text-lg text-gray-300 mb-8 max-w-lg font-medium border-l-2 border-yellow-500 pl-4">
                        Professional-grade components for the modern driver. Trusted performance, inspected for excellence.
                    </p>
                </div>
            </section>

            {/* CATEGORIES GRID */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-gray-200 bg-white">
                    {categories.map((cat) => (
                        <div 
                            key={cat.id} 
                            onClick={() => navigate(`/${cat.id}`)}
                            className="p-8 border-r border-b md:border-b-0 last:border-r-0 border-gray-100 hover:bg-gray-50 cursor-pointer transition-all group text-center"
                        >
                            <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {cat.icon}
                            </div>
                            <h3 className="font-black text-xs uppercase tracking-widest text-gray-900">{cat.name}</h3>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => navigate("/categories")}
                    className="w-full flex items-center justify-center gap-3 bg-black text-white font-black uppercase italic tracking-[0.2em] text-xs py-5 hover:bg-yellow-500 hover:text-black transition-colors"
                >
                    View All Categories <ArrowRight size={16} />
                </button>
                
                {/* XPLORE AUTOPARTS Text */}
                <div className="text-center mt-16 mb-24">
                    <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-gray-900">
                        XPLORE <span className="text-yellow-500">AUTOPARTS</span>
                    </h2>
                </div>
            </div>

            {/* PRODUCT SECTIONS */}
            <div className="max-w-7xl mx-auto px-6 mt-24 space-y-24">
                
                {/* Featured */}
                <section>
                    <div className="flex items-end justify-between mb-8 border-b-2 border-black pb-4">
                        <div>
                            <span className="text-yellow-500 font-black uppercase tracking-widest text-[10px]">Editor's Choice</span>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                                <Sparkles size={24} className="text-black" /> Featured Inventory
                            </h2>
                        </div>
                        <button onClick={() => navigate("/xplore/featured")} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-yellow-600">
                            See All <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {allProducts.filter(p => p.tag === 'featured').slice(0, 3).map(product => (
                            <ProductCard key={product.id} product={product} navigate={navigate} badge="Featured" />
                        ))}
                    </div>
                </section>

                {/* Hot Products */}
                <section>
                    <div className="flex items-end justify-between mb-8 border-b-2 border-black pb-4">
                        <div>
                            <span className="text-red-500 font-black uppercase tracking-widest text-[10px]">Trending</span>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                                <Flame size={24} className="text-black" /> Hot Right Now
                            </h2>
                        </div>
                        <button onClick={() => navigate("/xplore/trending")} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-yellow-600">
                            See All <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                        {allProducts.filter(p => p.tag === 'popular').slice(0, 4).map(product => (
                            <ProductCard key={product.id} product={product} navigate={navigate} badge="Hot" />
                        ))}
                    </div>
                </section>

                {/* New Arrivals */}
                <section>
                    <div className="flex items-end justify-between mb-8 border-b-2 border-black pb-4">
                        <div>
                            <span className="text-blue-500 font-black uppercase tracking-widest text-[10px]">Just Added</span>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                                <TrendingUp size={24} className="text-black" /> New Arrivals
                            </h2>
                        </div>
                        <button onClick={() => navigate("/xplore/new")} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-yellow-600">
                            See All <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {allProducts.filter(p => p.tag === 'new' || p.tag === 'editor').slice(0, 4).map(product => (
                            <ProductCard key={product.id} product={product} navigate={navigate} badge="New" />
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}