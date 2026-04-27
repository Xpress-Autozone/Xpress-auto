import React, { useState, useEffect, useRef } from "react";
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
import { useSelector } from "react-redux";
import SkeletonLoader from "../../Components/SkeletonLoader/skeletonLoader";
import EmptyState from "../../Components/EmptyState/EmptyState";
import HeroMedia from "../../Components/HeroMedia/HeroMedia";
import { getAllProducts } from "../../lib/productService";
import productsSrip from "../../assets/productsStrip.webp";
import brakesImage from "../../assets/brakes.webp";
import tiresImage from "../../assets/wheels-tires.webp";
import featuredHero from "../../assets/heroes/featured-hero.png";

const categories = [
    {
        name: "Body & Parts",
        id: "body-chassis",
        icon: <img src="/assets/category-icons/body-parts.webp" alt="Body & Parts" className="w-10 h-10 mx-auto object-contain" />
    },
    {
        name: "Engine & Performance",
        id: "engine-performance",
        icon: <img src="/assets/category-icons/engine-performance.webp" alt="Engine & Performance" className="w-10 h-10 mx-auto object-contain" />
    },
    {
        name: "Lighting & Electronics",
        id: "lighting-electronics",
        icon: <img src="/assets/category-icons/lighting-electronics.webp" alt="Lighting & Electronics" className="w-10 h-10 mx-auto object-contain" />
    },
    {
        name: "Accessories",
        id: "accessories",
        icon: <img src="/assets/category-icons/accessories.webp" alt="Accessories" className="w-10 h-10 mx-auto object-contain" />
    },
];

import ProductCard from "../../Components/ProductCard/ProductCard";

// CinematicVideo removed, replaced by HeroMedia

export default function XplorePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [transitionToVideo, setTransitionToVideo] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (productsSrip) {
            const img = new Image();
            img.src = productsSrip;
            img.onload = () => setImageLoaded(true);
        }
    }, []);

    const cinematicVideos = [
        {
            poster: tiresImage,
            webm: "/assets/videos/1. 3d-rendered-orange-colored-super-car-running-on-street-at_34634300.webm",
            mp4: "/assets/videos/1. 3d-rendered-orange-colored-super-car-running-on-street-at_34634300.mp4"
        },
        {
            poster: brakesImage,
            webm: "/assets/videos/2. yellow car engine video upclose.webm",
            mp4: "/assets/videos/2. yellow car engine video upclose.mp4"
        },
        {
            poster: featuredHero,
            webm: "/assets/videos/3. OIG1.webm",
            mp4: "/assets/videos/3. OIG1.mp4"
        }
    ];

    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const vehicle = user?.vehicle;

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                console.log("[Xplore] 🚀 Fetching all products");
                const data = await getAllProducts({ limit: 100, page: 1 });

                if (data.success && data.data) {
                    console.log(`[Xplore] ✅ Received ${data.data.length} products`);
                    setProducts(
                        data.data.map((p) => {
                            let imageUrl = "https://placehold.co/400x320";
                            if (typeof p.mainImage === 'string' && p.mainImage.startsWith('http')) {
                                imageUrl = p.mainImage;
                            } else if (p.mainImage?.url) {
                                imageUrl = p.mainImage.url;
                            } else if (p.image && typeof p.image === 'string' && p.image.startsWith('http')) {
                                imageUrl = p.image;
                            } else if (p.mainImage?.imageUrl) {
                                imageUrl = p.mainImage.imageUrl;
                            }

                            return {
                                id: p.id,
                                name: p.itemName,
                                price: parseFloat(p.price) || 0,
                                image: imageUrl,
                                featured: p.featured,
                                hotProduct: p.hotProduct,
                                newProduct: p.newProduct,
                                showOnHome: p.showOnHome,
                                // Pass full data for detail page
                                description: p.description,
                                specifications: p.specifications,
                                compatibility: p.compatibility,
                                category: p.category,
                                additionalImages: p.additionalImages || []
                            };
                        })
                    );
                } else {
                    console.warn("[Xplore] ⚠️ No products found");
                    setProducts([]);
                }
            } catch (error) {
                console.error("[Xplore] ❌ Error fetching products:", error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTransitionToVideo(true);
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    // Rotate videos every 7 seconds
    useEffect(() => {
        if (transitionToVideo) {
            const interval = setInterval(() => {
                setCurrentVideoIndex((prev) => (prev + 1) % cinematicVideos.length);
            }, 7000);
            return () => clearInterval(interval);
        }
    }, [transitionToVideo]);

    if (isLoading) return <SkeletonLoader />;

    // --- PERSONALIZATION ENGINE ---
    const getMatchedProducts = () => {
        if (!vehicle || !vehicle.make) return [];
        
        const makeStr = vehicle.make.toLowerCase();
        const modelStr = vehicle.model?.toLowerCase() || "";
        
        return products.filter(p => {
            const name = p.name?.toLowerCase() || "";
            const desc = p.description?.toLowerCase() || "";
            const comp = p.compatibility ? JSON.stringify(p.compatibility).toLowerCase() : "";
            
            return name.includes(makeStr) || 
                   desc.includes(makeStr) || 
                   comp.includes(makeStr) ||
                   (modelStr && (name.includes(modelStr) || desc.includes(modelStr) || comp.includes(modelStr)));
        }).slice(0, 4);
    };

    const matchedProducts = getMatchedProducts();
    const featuredProducts = products.filter(p => p.featured).slice(0, 3);
    const hotProducts = products.filter(p => p.hotProduct).slice(0, 4);
    const newProducts = products.filter(p => p.newProduct).slice(0, 4);

    return (
        <main className="min-h-screen bg-white pb-20">

            {/* HERO SECTION */}
            <section className="relative h-[450px] w-full bg-zinc-900 overflow-hidden group">
                {/* Static Hero (Initial State) */}
                <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${transitionToVideo ? "opacity-0" : "opacity-100"}`}>
                    <div
                        className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
                            imageLoaded ? "opacity-50 blur-0 scale-100" : "opacity-0 blur-xl scale-110"
                        }`}
                        style={{ backgroundImage: `url(${productsSrip})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent font-medium" />
                    
                    <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center text-white">
                        <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-xs mb-4">Quality Guaranteed</span>
                        <h1 className="text-4xl md:text-7xl font-black mb-6 leading-[0.9] uppercase italic tracking-tighter">
                            UPGRADE <br />YOUR RIDE
                        </h1>
                        <p className="text-base md:text-lg text-gray-300 mb-8 max-w-lg font-medium border-l-2 border-yellow-500 pl-4">
                            Professional-grade components for the modern driver. Trusted performance, inspected for excellence.
                        </p>
                    </div>
                </div>

                {/* Cinematic Video Sequence (Passive State) */}
                <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${transitionToVideo ? "opacity-100" : "opacity-0"}`}>
                    {cinematicVideos.map((video, idx) => {
                        const isActive = idx === currentVideoIndex;
                        const isNext = idx === (currentVideoIndex + 1) % cinematicVideos.length;
                        
                        if (!isActive && !isNext) return null;

                        return (
                            <HeroMedia 
                                key={idx}
                                type="video"
                                poster={video.poster}
                                videoWebm={video.webm}
                                videoMp4={video.mp4}
                                isActive={isActive}
                            />
                        );
                    })}
                </div>
            </section>

            {/* CATEGORIES GRID */}
            <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-gray-200 bg-white shadow-xl">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => navigate(`/${cat.id}`)}
                            className="p-5 border-r border-b md:border-b-0 last:border-r-0 border-gray-100 hover:bg-gray-50 cursor-pointer transition-all group text-center"
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

                <div className="text-center mt-8 md:mt-16 mb-12 md:mb-24">
                    <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter text-gray-900">
                        XPLORE <span className="text-yellow-500">AUTOPARTS</span>
                    </h2>
                </div>
            </div>

            {/* PRODUCT SECTIONS */}
            <div className="max-w-7xl mx-auto px-6 mt-12 md:mt-24 space-y-24">

                {/* PERSONALIZED MATCHES or GUEST CTA */}
                {matchedProducts.length > 0 ? (
                    <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="flex items-end justify-between mb-8 border-b-2 border-yellow-500 pb-4">
                            <div>
                                <span className="text-yellow-500 font-black uppercase tracking-widest text-[10px]">Your Garage Matching</span>
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                                    <Car size={24} className="text-black" /> Matches for your {vehicle.make} {vehicle.model}
                                </h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {matchedProducts.map(product => (
                                <ProductCard key={product.id} product={product} navigate={navigate} badge="Matching" />
                            ))}
                        </div>
                    </section>
                ) : !user ? (
                    <section className="bg-black border-2 border-yellow-500/20 p-8 md:p-16 text-white overflow-hidden relative group animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="max-w-xl text-center md:text-left">
                                <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] mb-6">
                                    FUEL YOUR <br />
                                    <span className="text-yellow-500/50">DISCOVERY ENGINE</span>
                                </h2>
                                
                                <ul className="space-y-4 mb-8 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-300">
                                    <li className="flex items-center gap-3 justify-center md:justify-start">
                                        <div className="w-1 h-1 bg-yellow-500 rounded-full shadow-[0_0_5px_#EAB308]" /> 
                                        Compatibility Verification
                                    </li>
                                    <li className="flex items-center gap-3 justify-center md:justify-start">
                                        <div className="w-1 h-1 bg-yellow-500 rounded-full shadow-[0_0_5px_#EAB308]" /> 
                                        Personalized Trending Alerts
                                    </li>
                                    <li className="flex items-center gap-3 justify-center md:justify-start">
                                        <div className="w-1 h-1 bg-yellow-500 rounded-full shadow-[0_0_5px_#EAB308]" /> 
                                        Admin-Verified Parts Access
                                    </li>
                                </ul>

                                <p className="text-xs md:text-sm font-medium text-gray-400 max-w-sm mx-auto md:mx-0 leading-relaxed">
                                    Create an account to unlock parts curated specifically for your machine.
                                </p>
                            </div>

                            <div className="shrink-0 w-full md:w-auto">
                                <button 
                                    onClick={() => navigate("/signup")}
                                    className="w-full md:w-auto bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black px-10 py-5 font-black uppercase italic tracking-[0.2em] text-xs shadow-[0_10px_40px_rgba(234,179,8,0.2)] hover:shadow-[0_15px_50px_rgba(234,179,8,0.35)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group/btn"
                                >
                                    Create Account <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                                </button>
                                <p className="mt-4 text-center text-[8px] font-black uppercase tracking-[0.3em] text-gray-600">
                                    Setup takes 60 seconds
                                </p>
                            </div>
                        </div>
                    </section>
                ) : null}

                {/* Featured */}
                <section>
                    <div className="flex items-end justify-between mb-8 border-b-2 border-black pb-4">
                        <div>
                            <span className="text-yellow-500 font-black uppercase tracking-widest text-[10px]">Editor's Choice</span>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                                <Sparkles size={24} className="text-black" /> Featured Inventory
                            </h2>
                        </div>
                    </div>
                    {featuredProducts.length === 0 ? (
                        <div className="py-20">
                            <EmptyState message="No featured products available." />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {featuredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} navigate={navigate} badge="Featured" />
                                ))}
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button onClick={() => navigate("/xplore/featured")} className="text-[12px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-yellow-600 border-b-2 border-transparent hover:border-yellow-600 pb-1 transition-all">
                                    See All <ArrowRight size={16} />
                                </button>
                            </div>
                        </>
                    )}
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
                    </div>
                    {hotProducts.length === 0 ? (
                        <div className="py-20">
                            <EmptyState message="No trending products available." />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {hotProducts.map(product => (
                                    <ProductCard key={product.id} product={product} navigate={navigate} badge="Hot" />
                                ))}
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button onClick={() => navigate("/xplore/trending")} className="text-[12px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-yellow-600 border-b-2 border-transparent hover:border-yellow-600 pb-1 transition-all">
                                    See All <ArrowRight size={16} />
                                </button>
                            </div>
                        </>
                    )}
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
                    </div>
                    {newProducts.length === 0 ? (
                        <div className="py-20">
                            <EmptyState message="No new products available." />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {newProducts.map(product => (
                                    <ProductCard key={product.id} product={product} navigate={navigate} badge="New" />
                                ))}
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button onClick={() => navigate("/xplore/new")} className="text-[12px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-yellow-600 border-b-2 border-transparent hover:border-yellow-600 pb-1 transition-all">
                                    See All <ArrowRight size={16} />
                                </button>
                            </div>
                        </>
                    )}
                </section>

            </div>
        </main>
    );
}
