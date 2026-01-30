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
import EmptyState from "../../Components/EmptyState/EmptyState";
import { getAllProducts } from "../../lib/productService";
import productsSrip from "../../assets/productsStrip.jpg";
import SEO from "../../lib/SEOHelper";
import { getPageMetadata } from "../../data/pageMetadata";

const categories = [
    {
        name: "Body & Parts",
        id: "body-chassis",
        icon: <img src="/assets/icons/parts.png" alt="Body & Parts" className="w-5 h-5 mx-auto" />
    },
    {
        name: "Engine & Performance",
        id: "engine-performance",
        icon: <img src="/assets/icons/engine.png" alt="Engine & Performance" className="w-6 h-5 mx-auto" />
    },
    {
        name: "Lighting & Electronics",
        id: "lighting-electronics",
        icon: <img src="/assets/icons/battery.png" alt="Lighting & Electronics" className="w-5 h-4 mx-auto" />
    },
    {
        name: "Accessories",
        id: "accessories",
        icon: <img src="/assets/icons/steer.png" alt="Accessories" className="w-5 h-5 mx-auto" />
    }
];

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
                <div className={`absolute top-0 left-0 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 ${badge === 'Featured' ? 'bg-yellow-500 text-black' : badge === 'Hot' ? 'bg-red-600' : 'bg-black'
                    }`}>
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
                        <Star key={i} size={12} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} />
                    ))}
                </div>
                <span className="text-[10px] font-bold text-gray-400">({product.reviews || 0})</span>
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
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const metadata = getPageMetadata('xplore');
    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Xplore', url: '/xplore' }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                console.log("[Xplore] 🚀 Fetching all products");
                const data = await getAllProducts({ limit: 100, page: 1 });

                if (data.success && data.data) {
                    console.log(`[Xplore] ✅ Received ${data.data.length} products`);
                    setProducts(
                        data.data.map((p) => ({
                            id: p.id,
                            name: p.itemName,
                            price: parseFloat(p.price) || 0,
                            image: p.mainImage?.url || "/api/placeholder/200/200",
                            rating: 4.5,
                            reviews: 0,
                        }))
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

    if (isLoading) return <SkeletonLoader />;

    const featuredProducts = products.slice(0, 3);
    const hotProducts = products.slice(3, 7);
    const newProducts = products.slice(7, 11);

    return (
        <main className="min-h-screen bg-white pb-20">
            <SEO
                title={metadata.title}
                description={metadata.description}
                keywords={metadata.keywords}
                ogUrl={metadata.url}
                ogImage={metadata.ogImage}
                ogType={metadata.ogType}
                canonicalUrl={metadata.url}
                breadcrumbs={breadcrumbs}
            />
            {/* HERO SECTION */}
            <section className="relative h-[450px] w-full bg-black overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: `url(${productsSrip})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center text-white">
                    <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-xs mb-4">Quality Guaranteed</span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[0.9] uppercase italic tracking-tighter">
                        UPGRADE <br />YOUR RIDE
                    </h1>
                    <p className="text-md md:text-lg text-gray-100 mb-8 max-w-lg font-medium border-l-2 border-yellow-500 pl-4">
                        Xplore our curated selection of products. Professional-grade components for the modern driver.
                    </p>
                </div>
            </section>

            {/* CATEGORIES GRID */}
            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-gray-200 bg-white">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => navigate(`/${cat.id}`)}
                            className="p-4 border-r border-b md:border-b-0 last:border-r-0 border-gray-100 hover:bg-gray-50 cursor-pointer transition-all group text-center"
                        >
                            <div className="w-6 h-6 mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {cat.icon}
                            </div>
                            <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-900">{cat.name}</h3>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => navigate("/categories")}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white font-black uppercase italic tracking-[0.2em] text-[10px] py-3 hover:bg-yellow-500 hover:text-black transition-colors"
                >
                    View All Categories <ArrowRight size={14} />
                </button>

                <div className="text-center mt-16 mb-24">
                    <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter text-gray-900">
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
                    {featuredProducts.length === 0 ? (
                        <div className="py-20">
                            <EmptyState message="No featured products available." />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} navigate={navigate} badge="Featured" />
                            ))}
                        </div>
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
                        <button onClick={() => navigate("/xplore/trending")} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-yellow-600">
                            See All <ArrowRight size={14} />
                        </button>
                    </div>
                    {hotProducts.length === 0 ? (
                        <div className="py-20">
                            <EmptyState message="No trending products available." />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {hotProducts.map(product => (
                                <ProductCard key={product.id} product={product} navigate={navigate} badge="Hot" />
                            ))}
                        </div>
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
                        <button onClick={() => navigate("/xplore/new")} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-yellow-600">
                            See All <ArrowRight size={14} />
                        </button>
                    </div>
                    {newProducts.length === 0 ? (
                        <div className="py-20">
                            <EmptyState message="No new products available." />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {newProducts.map(product => (
                                <ProductCard key={product.id} product={product} navigate={navigate} badge="New" />
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}
