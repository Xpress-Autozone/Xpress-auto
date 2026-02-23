import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ShoppingCart,
  ArrowLeft,
  Check,
  Share2,
  Facebook,
  MessageCircle,
  Link2,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { getProductById, getProductsByCategory, getAllProducts } from "../../lib/productService";
import SkeletonLoader from "../SkeletonLoader/skeletonLoader";
import SEO from "../../lib/SEOHelper";
import toast from "react-hot-toast";

const XIcon = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 2.846H4.294l13.313 17.804z" />
  </svg>
);

const ShareActions = ({ product }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;
  const shareTitle = `Check out ${product.name} on Xpress Autozone! 🏎️💨`;
  const shareText = `Check out ${product.name} by ${product.brand || 'Xpress Autozone'}! \n\nImage: ${product.image}\n\n${shareUrl}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Check out ${product.name} on Xpress Autozone!`,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Error sharing:", err);
        }
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 3000);
  };

  const shareAvenues = [
    {
      name: "WhatsApp",
      icon: <MessageCircle size={18} fill="currentColor" />,
      color: "text-[#25D366]",
      hoverBg: "hover:bg-[#25D366]/10",
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")
    },
    {
      name: "X",
      icon: <XIcon size={16} />,
      color: "text-black",
      hoverBg: "hover:bg-black/10",
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, "_blank")
    },
    {
      name: "Facebook",
      icon: <Facebook size={18} fill="currentColor" />,
      color: "text-[#1877F2]",
      hoverBg: "hover:bg-[#1877F2]/10",
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <div className="flex items-center gap-4">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Share</span>

        <div className="flex items-center gap-2">
          {shareAvenues.map((avenue) => (
            <button
              key={avenue.name}
              onClick={avenue.action}
              title={`Share on ${avenue.name}`}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${avenue.color} ${avenue.hoverBg} border border-transparent hover:border-gray-100`}
            >
              {avenue.icon}
            </button>
          ))}

          <button
            onClick={handleCopyLink}
            title="Copy Link"
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all border ${copied ? "bg-green-500 border-green-500 text-white" : "text-gray-600 hover:text-black hover:bg-gray-50 border-transparent hover:border-gray-100"}`}
          >
            {copied ? <CheckCircle size={18} /> : <Link2 size={18} />}
          </button>

          {navigator.share && (
            <div className="h-6 w-[1px] bg-gray-100 mx-1" />
          )}

          {navigator.share && (
            <button
              onClick={handleNativeShare}
              title="More Options"
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all text-black hover:bg-yellow-500 border border-transparent hover:border-yellow-500"
            >
              <Share2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ActiveProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(location.state?.product || null);
  const [isLoading, setIsLoading] = useState(!product);
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSection, setExpandedSection] = useState("details");
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  React.useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      // Ensure we have a loading state if we don't even have partial state
      if (!product || product.id !== id) {
        setIsLoading(true);
      }

      try {
        console.log(`[ActiveProductPage] 🔄 Hydrating product data for: ${id}`);
        const data = await getProductById(id);

        if (data) {
          const fullProduct = {
            id: data.id,
            name: data.itemName,
            price: parseFloat(data.price) || 0,
            image: data.mainImage?.url || (typeof data.mainImage === 'string' ? data.mainImage : "/api/placeholder/200/200"),
            images: [
              ...(data.mainImage?.url ? [data.mainImage.url] : (typeof data.mainImage === 'string' ? [data.mainImage] : [])),
              ...(data.additionalImages?.map(img => typeof img === 'object' ? img.url : img) || [])
            ],
            description: data.description,
            category: data.category,
            brand: data.brand,
            partNumber: data.partNumber,
            status: (data.quantity > 0 || data.stock > 0) ? "In Stock" : "Out of Stock",
            specifications: Array.isArray(data.specifications) ? data.specifications : [],
            compatibility: Array.isArray(data.compatibility) ? data.compatibility : [],
          };

          setProduct(fullProduct);
          setError(null);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        // If we have partial state, don't show full error yet, just log it
        if (!product) {
          setError("Failed to load product details");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  React.useEffect(() => {
    const fetchRelated = async () => {
      if (product?.category || product?.categoryId) {
        try {
          console.log(`[ActiveProductPage] 🔍 Fetching recommendations for category: ${product.category}`);
          // Use getAllProducts with a larger limit to ensure we find matches if the specific category endpoint is flaky
          const data = await getAllProducts({ limit: 100, page: 1 });

          if (data.success && data.data) {
            const currentCat = product.category || product.categoryId;

            // Filter products by category and exclude current product
            const filtered = data.data
              .filter(p =>
                (p.category === currentCat || p.categoryId === currentCat) &&
                p.id !== product.id
              )
              .slice(0, 6)
              .map(p => {
                // Robust image handling consistent with CategoryPage.jsx
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
                  name: p.itemName || p.name || "Unnamed Product",
                  price: `GH₵${parseFloat(p.price || 0).toFixed(2)}`,
                  image: imageUrl,
                  badge: p.brand || "Verified",
                  fullProduct: p
                };
              });

            console.log(`[ActiveProductPage] ✅ Found ${filtered.length} matching recommendations`);
            setRelatedProducts(filtered);
          }
        } catch (err) {
          console.error("Error fetching related products:", err);
        }
      }
    };
    fetchRelated();
  }, [product?.id, product?.category, product?.categoryId]);

  if (isLoading) return <SkeletonLoader />;
  if (error) return <div className="pt-24 text-center font-black uppercase italic">{error}</div>;
  if (!product) return <div className="pt-24 text-center font-black uppercase italic">Product not found</div>;

  const images = product.images || [product.image, "/api/placeholder/400/400"];

  const specifications = [
    ...(Array.isArray(product.specifications) ? product.specifications : []),
    ...(product.brand ? [{ label: "Manufacturer:", value: product.brand }] : []),
    ...(product.partNumber ? [{ label: "Part Number:", value: product.partNumber }] : []),
    ...(product.category ? [{ label: "Category:", value: product.category }] : []),
  ];

  // Default fallbacks if no specs at all
  if (specifications.length === 0) {
    specifications.push(
      { label: "Manufacturer:", value: "Not specified" },
      { label: "Category:", value: "General" }
    );
  }

  const compatibility = Array.isArray(product.compatibility)
    ? product.compatibility
    : (product.compatibility ? [product.compatibility] : ["Universal Fit"]);

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
      <SEO
        title={product.name}
        description={product.description || `Buy ${product.name} at Xpress Autozone. Quality part for ${product.brand || 'your vehicle'}.`}
        ogImage={product.image}
        ogUrl={window.location.href}
        ogType="product"
      />
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
                  className={`aspect-square border-2 transition-all p-2 bg-white ${selectedImage === idx ? "border-black" : "border-gray-100 hover:border-gray-300"
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
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 border ${product.status === "In Stock" ? "border-green-500 text-green-600" : "border-orange-500 text-orange-600"
                  }`}>
                  {product.status || "Check Availability"}
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              className={`w-full font-black uppercase italic tracking-[0.2em] py-5 transition-all flex items-center justify-center gap-3 mb-2 ${addedToCart
                ? "bg-green-500 text-white"
                : "bg-yellow-500 hover:bg-black hover:text-white text-black"
                }`}
            >
              <ShoppingCart size={20} />
              {addedToCart ? "Added to Cart!" : "Add to Cart"}
            </button>

            <ShareActions product={product} />

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

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p, idx) => (
              <div
                key={p.id || idx}
                onClick={() => navigate(`/product/${p.id}`, { state: { product: p.fullProduct } })}
                className="group border border-gray-100 hover:border-black transition-all cursor-pointer"
              >
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

          <div className="mt-12 flex justify-center">
            <button
              onClick={() => navigate("/xplore")}
              className="bg-yellow-500 hover:bg-black hover:text-white text-black font-black uppercase italic tracking-[0.2em] px-12 py-5 transition-all flex items-center gap-2 group"
            >
              Xplore autozone
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
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
