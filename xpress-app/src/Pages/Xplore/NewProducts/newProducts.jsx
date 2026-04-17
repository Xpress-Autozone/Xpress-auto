import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ChevronLeft, TrendingUp } from "lucide-react";
import SkeletonLoader from "../../../Components/SkeletonLoader/skeletonLoader";
import EmptyState from "../../../Components/EmptyState/EmptyState";
import { getAllProducts } from "../../../lib/productService";

import ProductCard from "../../../Components/ProductCard/ProductCard";

export default function NewProducts() {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                console.log("[NewProducts] 🚀 Fetching products");
                const data = await getAllProducts({ limit: 100, page: 1 });
                
                if (data.success && data.data) {
                    console.log(`[NewProducts] ✅ Received ${data.data.length} products`);
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
                    setProducts([]);
                }
            } catch (error) {
                console.error("[NewProducts] ❌ Error:", error);
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

            <div className="max-w-7xl mx-auto px-6">
                {products.length === 0 ? (
                    <div className="py-20">
                        <EmptyState message="No new products available." />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} badge="New" />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
