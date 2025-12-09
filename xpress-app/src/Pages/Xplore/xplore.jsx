import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Flame, 
  Sparkles, 
  Car, 
  Search,
  ShieldCheck,
  Truck,
  Wrench,
  ShoppingCart,
  Package,
  Circle,
  Battery,
  Settings,
  Zap,
  ArrowRight
} from "lucide-react";
import SkeletonLoader from "../../Components/SkeletonLoader/skeletonLoader";
import productsSrip from "../../assets/productsStrip.jpg";

// --- MOCK DATA ---
const categories = [
    { name: "Engine Parts", id: "engine-parts", icon: Package },
    { name: "Suspension & Steering", id: "suspension-steering", icon: Wrench },
    { name: "Tires & Wheels", id: "tires-wheels", icon: Circle },
    { name: "Electrical Components", id: "electrical-components", icon: Battery },
];

const allProducts = [
    // Merging all your data sources for the search functionality
    { id: 1, name: "Premium Brake Pads", price: 99.99, image: "/api/placeholder/300/300", rating: 4.8, reviews: 250, category: "brakes", tag: "featured" },
    { id: 2, name: "LED Headlights", price: 149.99, image: "/api/placeholder/300/300", rating: 4.9, reviews: 320, category: "lighting", tag: "featured" },
    { id: 3, name: "All-Season Tires", price: 129.99, image: "/api/placeholder/300/300", rating: 4.7, reviews: 180, category: "tires", tag: "featured" },
    { id: 4, name: "Air Filter", price: 29.99, image: "/api/placeholder/200/200", rating: 4.5, reviews: 120, category: "engine" },
    { id: 5, name: "Oil Filter", price: 19.99, image: "/api/placeholder/200/200", rating: 4.7, reviews: 98, category: "engine" },
    { id: 6, name: "Shock Absorber", price: 89.99, image: "/api/placeholder/200/200", rating: 4.8, reviews: 150, category: "suspension" },
    { id: 7, name: "Brake Pads", price: 49.99, image: "/api/placeholder/200/200", rating: 4.7, reviews: 300, category: "brakes", tag: "popular" },
    { id: 8, name: "Car Battery", price: 129.99, image: "/api/placeholder/200/200", rating: 4.8, reviews: 250, category: "electrical", tag: "popular" },
    { id: 9, name: "Performance Exhaust", price: 299.99, image: "/api/placeholder/200/200", rating: 4.9, reviews: 180, category: "exhaust", tag: "editor" },
    { id: 10, name: "Smart Tire Monitor", price: 79.99, image: "/api/placeholder/200/200", rating: 4.6, reviews: 50, category: "electronics", tag: "new" },
];

// --- REUSABLE COMPONENTS ---

// 1. The Revamped Product Card
const ProductCard = ({ product, navigate, badge }) => (
    <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex flex-col h-full"
    >
        {/* Image Container with Zoom Effect */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
            <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
            />
            {badge && (
                <div className={`absolute top-3 left-3 text-xs font-bold opacity-70
                    ${badge === 'New' ? 'text-blue-500' : 
                      badge === 'Hot' ? 'text-red-500' : 
                      'text-yellow-500'}`
                }>
                    {badge}
                </div>
            )}
            {/* Quick Action Button overlay */}
            <div className="absolute bottom-3 right-3 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                <button className="bg-white p-2 rounded-full shadow-lg hover:bg-yellow-400 text-gray-800 transition-colors">
                    <ShoppingCart size={20} />
                </button>
            </div>
        </div>

        {/* Content */}
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

// 2. Trust Badge Component
const TrustItem = ({ icon: Icon, title, desc }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
        <div className="bg-white p-3 rounded-full shadow-sm text-yellow-500">
            <Icon size={24} />
        </div>
        <div>
            <h4 className="font-bold text-gray-800">{title}</h4>
            <p className="text-sm text-gray-500">{desc}</p>
        </div>
    </div>
);

export default function XplorePage() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <SkeletonLoader />;

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            
            {/* HERO SECTION */}
            <section className="relative h-[400px] w-full overflow-hidden pt-20 md:pt-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${productsSrip})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20" />
                
                <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center text-white">

                    <h1 className="text-5xl md:text-6xl font-bold mb-4 max-w-2xl">
                        Upgrade Your Ride <br/>
                        <span className="text-gray-300">Maintain The Value</span>
                    </h1>
                    <p className="text-lg text-gray-100 mb-8 max-w-xl">
                        Find exact parts of the highest quality. Trusted by hundreds of vehicle owners and inspected by our team. 
                    </p>
                </div>
            </section>

            {/* VEHICLE FITMENT BAR (Overlapping Hero) */}
          {/* <div className="relative -mt-10 px-6 z-20">
                <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-2 md:p-4 border border-gray-200">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex items-center gap-2 px-4 border-r border-gray-200 w-full md:w-auto">
                            <Car className="text-yellow-500" />
                            <span className="font-bold whitespace-nowrap">My Garage</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 w-full">
                            {['Year', 'Make', 'Model'].map((placeholder) => (
                                <select key={placeholder} className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5">
                                    <option>{placeholder}</option>
                                </select>
                            ))}
                        </div>
                        <button className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-md whitespace-nowrap">
                            Check Fit
                        </button>
                    </div>
                </div>
            </div> */}

            {/* CATEGORIES */}
            <div className="max-w-7xl mx-auto px-6 mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Explore Components</h2>

                {/* Categories Grid */}
                <div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {categories.map((cat) => {
                                const IconComponent = cat.icon;
                                return (
                                    <div 
                                        key={cat.id} 
                                        onClick={() => navigate(`/${cat.id}`)}
                                        className="bg-white p-6 rounded-xl border border-gray-100 hover:border-yellow-400 hover:shadow-md cursor-pointer transition-all text-center group"
                                    >
                                        <IconComponent className="w-10 h-10 mx-auto mb-3 text-gray-700 group-hover:text-yellow-500 transition-colors group-hover:scale-110" />
                                        <h3 className="font-semibold text-gray-700 group-hover:text-black">{cat.name}</h3>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => navigate("/categories")}
                            className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition-colors mb-12"
                        >
                            View All Categories
                            <ArrowRight className="w-5 h-5" />
                        </button>
                </div>
            </div>

            {/* DYNAMIC PRODUCT LISTS */}
            <div className="max-w-7xl mx-auto px-6 space-y-16">
                <>
                        {/* Featured */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Sparkles className="text-yellow-500" /> Featured This Week
                                </h2>
                                <button 
                                    onClick={() => navigate("/xplore/featured")}
                                    className="flex items-center gap-1 text-sm font-semibold text-yellow-600 hover:text-yellow-700">
                                    See all featured products
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {allProducts.filter(p => p.tag === 'featured').slice(0, 4).map(product => (
                                    <ProductCard key={product.id} product={product} navigate={navigate} badge="Featured" />
                                ))}
                            </div>
                        </section>

                        {/* Most Popular */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Flame className="text-red-500" /> Hot Right Now
                                </h2>
                                <button 
                                    onClick={() => navigate("/xplore/trending")}
                                    className="flex items-center gap-1 text-sm font-semibold text-yellow-600 hover:text-yellow-700">
                                    See all trending
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {allProducts.filter(p => p.tag === 'popular' || p.reviews > 150).slice(0, 4).map(product => (
                                    <ProductCard key={product.id} product={product} navigate={navigate} badge="Hot" />
                                ))}
                            </div>
                        </section>


                        {/* New Arrivals */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <TrendingUp className="text-blue-500" /> New Arrivals
                                </h2>
                                <button 
                                    onClick={() => navigate("/xplore/new")}
                                    className="flex items-center gap-1 text-sm font-semibold text-yellow-600 hover:text-yellow-700">
                                    See all new
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {allProducts.filter(p => p.tag === 'new' || p.tag === 'editor').slice(0, 4).map(product => (
                                    <ProductCard key={product.id} product={product} navigate={navigate} badge="New" />
                                ))}
                            </div>                           
   
                        </section>
                </>
            </div>
        </main>
    );
}