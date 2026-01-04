import React, { useState } from "react";
import { ChevronDown, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import SEO from "../../lib/SEOHelper";
import { getProductMetadata } from "../../data/pageMetadata";
import { generateProductSchema, generateBreadcrumbSchema } from "../../lib/SEOHelper";

const ActiveProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const product = location.state?.product || {};

  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSection, setExpandedSection] = useState("details");
  const [addedToCart, setAddedToCart] = useState(false);

  const images = product.images || [product.image, "/api/placeholder/400/400"];

  const specifications = product.specifications || [
    { label: "Manufacturer:", value: product.brand || "Not specified" },
    { label: "Part Number:", value: "XP-" + (product.id || "000") },
    { label: "Category:", value: product.category || "General" },
  ];

  const compatibility = product.compatibility || ["Universal Fit"];

  const relatedProducts = product.relatedProducts || [
    { name: "Performance Brake Fluid", price: "GH₵45.00", badge: "Essentials", image: "/api/placeholder/150/150" },
    { name: "Heavy Duty Wheel Bolts", price: "GH₵120.00", badge: "Trending", image: "/api/placeholder/150/150" },
  ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      status: product.status
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      {/* Product SEO */}
      {product && product.id && (
        <SEO
          title={`${product.name} | Buy at Xpress Autozone`}
          description={product.description || `Quality ${product.name} at Xpress Autozone. Check price, availability, and fast delivery options.`}
          keywords={`${product.name}, buy ${product.name}, ${product.category}, auto parts`}
          ogUrl={`https://xpressautozone.com/product/${product.id}`}
          ogImage={product.image}
          ogType="product"
          canonicalUrl={`https://xpressautozone.com/product/${product.id}`}
          structuredData={generateProductSchema(product)}
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: product.category || 'Products', url: '/product' },
            { name: product.name, url: `/product/${product.id}` }
          ]}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* BREADCRUMB & BACK */}
        <div className="mb-10 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </button>
          <span className="hidden md:block text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Home / {product.category || "Shop"} / {product.name || "Item"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* LEFT: IMAGE SUITE */}
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-100 p-10 flex items-center justify-center relative overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-contain mix-blend-multiply"
              />
              <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2">
                High Resolution
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square border-2 transition-all p-2 bg-white ${
                    selectedImage === idx ? "border-black" : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT DATA */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <Check size={16} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Inventory</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-black uppercase italic tracking-tighter leading-none mb-4">
                {product.name || "Automotive Component"}
              </h1>
              
              <div className="flex items-baseline gap-4 mt-6">
                <span className="text-4xl font-black italic">GH₵{(product.price || 0).toFixed(2)}</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 border ${
                  product.status === "In Stock" ? "border-green-500 text-green-600" : "border-orange-500 text-orange-600"
                }`}>
                  {product.status || "Check Availability"}
                </span>
              </div>
            </div>

            {/* CTA */}
            <button 
              onClick={handleAddToCart}
              className={`w-full font-black uppercase italic tracking-[0.2em] py-5 transition-all flex items-center justify-center gap-3 mb-10 ${
                addedToCart 
                  ? "bg-green-500 text-white" 
                  : "bg-yellow-500 hover:bg-black hover:text-white text-black"
              }`}
            >
              <ShoppingCart size={20} />
              {addedToCart ? "Added to Cart!" : "Add to Cart"}
            </button>

            {/* INFO ACCORDION */}
            <div className="border-t border-gray-100">
              <Section 
                title="Description" 
                id="details" 
                active={expandedSection} 
                toggle={toggleSection}
              >
                <p className="text-sm font-medium text-gray-500 leading-relaxed uppercase tracking-tight">
                  {product.description || "No manual description provided for this verified component."}
                </p>
              </Section>

              <Section 
                title="Technical Specs" 
                id="specs" 
                active={expandedSection} 
                toggle={toggleSection}
              >
                <div className="grid grid-cols-1 gap-4">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{spec.label}</span>
                      <span className="text-xs font-bold text-black uppercase">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section 
                title="Vehicle Compatibility" 
                id="compatibility" 
                active={expandedSection} 
                toggle={toggleSection}
              >
                <ul className="space-y-3">
                  {compatibility.map((v, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600 uppercase">
                      <div className="w-1 h-1 bg-yellow-500" /> {v}
                    </li>
                  ))}
                </ul>
              </Section>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-32">
          <div className="mb-10 border-b-2 border-black pb-4 flex justify-between items-end">
            <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">You Might Need These</h2>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recommended Extras</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p, idx) => (
              <div key={idx} className="group border border-gray-100 hover:border-black transition-all cursor-pointer">
                <div className="aspect-square bg-gray-50 p-6">
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="p-4 bg-white">
                  <span className="text-[9px] font-black text-yellow-600 uppercase tracking-widest mb-1 block">{p.badge}</span>
                  <h3 className="text-[11px] font-black uppercase tracking-tight mb-3 line-clamp-1">{p.name}</h3>
                  <p className="text-sm font-black italic">{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, id, active, toggle, children }) => (
  <div className="border-b border-gray-100 last:border-0">
    <button
      onClick={() => toggle(id)}
      className="w-full flex items-center justify-between py-5 text-left group"
    >
      <span className={`text-xs font-black uppercase tracking-widest transition-colors ${active === id ? 'text-black' : 'text-gray-400 group-hover:text-black'}`}>
        {title}
      </span>
      <ChevronDown size={16} className={`transition-transform duration-300 ${active === id ? "rotate-180" : ""}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${active === id ? "max-h-96 pb-6" : "max-h-0"}`}>
      {children}
    </div>
  </div>
);

export default ActiveProductPage;
