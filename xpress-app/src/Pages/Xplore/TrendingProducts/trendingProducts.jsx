import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ChevronLeft, Flame } from "lucide-react";
import SkeletonLoader from "../../../Components/SkeletonLoader/skeletonLoader";
import EmptyState from "../../../Components/EmptyState/EmptyState";
import { getAllProducts } from "../../../lib/productService";

import ProductCard from "../../../Components/ProductCard/ProductCard";
import heroImg from "../../../assets/heroes/trending-hero.png";

export default function TrendingProducts() {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                console.log("[TrendingProducts] 🚀 Fetching products");
                const data = await getAllProducts({ limit: 100, page: 1 });
                
                if (data.success && data.data) {
                    console.log(`[TrendingProducts] ✅ Received ${data.data.length} products`);
                    setProducts(
                        data.data.map((p) => ({
                            id: p.id,
                            name: p.itemName,
                            price: parseFloat(p.price) || 0,
                            image: p.mainImage?.url || "https://placehold.co/200x200",
                            additionalImages: p.additionalImages || [],
                            rating: 4.5,
                            reviews: 0,
                        }))
                    );
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("[TrendingProducts] ❌ Error:", error);
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
            <div className="relative border-b border-gray-100 pt-32 pb-16 mb-12 overflow-hidden bg-black text-white">
                <div className="absolute inset-0 z-0">
                    <img src={heroImg} alt="Hot Right Now Hero" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <button
                        onClick={() => navigate("/xplore")}
                        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 mb-8 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Return to Xplore
                    </button>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <span className="text-red-600 font-black uppercase tracking-[0.3em] text-xs">High Demand</span>
                            <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
                                Hot Right <br/> <span className="text-gray-400">Now</span>
                            </h1>
                        </div>
                        <p className="text-gray-300 font-medium max-w-sm border-l-2 border-red-600 pl-4 text-sm leading-relaxed">
                            These components are currently moving fast. Our most sought-after inventory, validated by the Xpress AutoZone community.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                {products.length === 0 ? (
                    <div className="py-20">
                        <EmptyState message="No trending products available." />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} badge="Hot" />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
