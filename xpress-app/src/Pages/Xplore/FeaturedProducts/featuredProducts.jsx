import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ChevronLeft, Sparkles } from "lucide-react";
import SkeletonLoader from "../../../Components/SkeletonLoader/skeletonLoader";
import EmptyState from "../../../Components/EmptyState/EmptyState";
import { getAllProducts } from "../../../lib/productService";

const ProductCard = ({ product, navigate }) => (
    <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="group bg-white border border-gray-200 hover:border-black transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
    >
        <div className="relative h-64 overflow-hidden bg-gray-50 border-b border-gray-100">
            <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain p-6 transform group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-2">
                Featured Item
            </div>
            <div className="absolute bottom-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button className="bg-yellow-500 p-4 text-black hover:bg-black hover:text-white transition-colors">
                    <ShoppingCart size={20} />
                </button>
            </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
            <h3 className="font-black text-gray-900 uppercase tracking-tight line-clamp-2 text-sm mb-2 leading-tight group-hover:text-yellow-600 transition-colors">
                {product.name}
            </h3>
            
            <div className="flex items-center gap-1 mb-4">
                <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} strokeWidth={3} />
                    ))}
                </div>
                <span className="text-[10px] font-black text-gray-400">({product.reviews || 0})</span>
            </div>

            <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-4">
                <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Price</span>
                    <span className="text-xl font-black italic text-black">GH₵{product.price.toFixed(2)}</span>
                </div>
                <div className="text-[9px] font-black uppercase px-2 py-1 border border-green-500 text-green-600 italic">
                    In Stock
                </div>
            </div>
        </div>
    </div>
);

export default function FeaturedProducts() {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                console.log("[FeaturedProducts] 🚀 Fetching products");
                const data = await getAllProducts({ limit: 100, page: 1 });
                
                if (data.success && data.data) {
                    console.log(`[FeaturedProducts] ✅ Received ${data.data.length} products`);
                    setProducts(
                        data.data.map((p) => ({
                            id: p.id,
                            name: p.itemName,
                            price: parseFloat(p.price) || 0,
                            image: p.mainImage?.url || "/api/placeholder/300/300",
                            rating: 4.5,
                            reviews: 0,
                        }))
                    );
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("[FeaturedProducts] ❌ Error:", error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (isLoading) return <SkeletonLoader />;

    return (
        <div className="min-h-screen bg-white pb-20">
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
                            <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-xs">Handpicked Selection</span>
                            <h1 className="text-4xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-none">
                                Featured <br/> <span className="text-gray-300">This Week</span>
                            </h1>
                        </div>
                        <p className="text-gray-500 font-medium max-w-sm border-l-2 border-black pl-4 text-sm leading-relaxed">
                            A curated collection of top-tier automotive components, verified for performance and reliability by our expert team.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                {products.length === 0 ? (
                    <div className="py-20">
                        <EmptyState message="No featured products available." />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} navigate={navigate} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
