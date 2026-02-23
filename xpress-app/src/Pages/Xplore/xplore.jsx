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

const ProductCard = ({ product, navigate, badge }) => (
    <div
        onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
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
                            let imageUrl = "/api/placeholder/400/320";
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

    if (isLoading) return <SkeletonLoader />;

    const featuredProducts = products.filter(p => p.featured).slice(0, 3);
    const hotProducts = products.filter(p => p.hotProduct).slice(0, 4);
    const newProducts = products.filter(p => p.newProduct).slice(0, 4);

    return (
        <main className="min-h-screen bg-white pb-20">

            {/* HERO SECTION */}
            <section className="relative h-[450px] w-full bg-black overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: `url(${productsSrip})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center text-white">
                    <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-xs mb-4">Quality Guaranteed</span>
                    <h1 className="text-4xl md:text-7xl font-black mb-6 leading-[0.9] uppercase italic tracking-tighter">
                        UPGRADE <br />YOUR RIDE
                    </h1>
                    <p className="text-base md:text-lg text-gray-300 mb-8 max-w-lg font-medium border-l-2 border-yellow-500 pl-4">
                        Professional-grade components for the modern driver. Trusted performance, inspected for excellence.
                    </p>
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
