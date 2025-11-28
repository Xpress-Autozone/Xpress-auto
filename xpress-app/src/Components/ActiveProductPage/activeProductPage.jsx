import React, { useState } from "react";
import { ChevronDown, ShoppingCart, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const ActiveProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product || {};

  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSection, setExpandedSection] = useState("details");

  // Use product data or fallback to placeholders
  const images = product.images || [
    "/api/placeholder/400/400",
    "/api/placeholder/400/400",
    "/api/placeholder/400/400",
    "/api/placeholder/400/400",
  ];

  const specifications = product.specifications || [
    { label: "Manufacturer:", value: "Not specified" },
    { label: "Part Number:", value: "Not specified" },
    { label: "Model:", value: "Not specified" },
    { label: "Speed Rating:", value: "Not specified" },
    { label: "Load Index:", value: "Not specified" },
    { label: "Treadwear:", value: "Not specified" },
    { label: "Traction:", value: "Not specified" },
    { label: "Temperature:", value: "Not specified" },
  ];

  const compatibility = product.compatibility || ["Not specified"];

  const relatedProducts = product.relatedProducts || [
    {
      name: "Related Product 1",
      price: "GH₵0.00",
      badge: "Not Available",
      image: "/api/placeholder/150/150",
    },
    {
      name: "Related Product 2",
      price: "GH₵0.00",
      badge: "Not Available",
      image: "/api/placeholder/150/150",
    },
  ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-8">
      {/* Desktop Layout */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-yellow-500 hover:text-yellow-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-500">
            {product.category || "Categories"} › {product.name || "Product"}
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div>
            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center sticky top-28">
              <img
                src={images[selectedImage]}
                alt={product.name || "Product"}
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 mt-6 flex-wrap">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-yellow-500"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover bg-gray-100"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name || "Product Name"}
            </h1>

            <div className="inline-block bg-yellow-400 text-black text-sm font-semibold px-3 py-2 rounded mb-6">
              ⭐ Verified by Xpress AutoZone
            </div>

            <div className="text-5xl font-bold text-gray-900 mb-4">
              GH₵{(product.price || 0).toFixed(2)}
            </div>

            <div className="text-base text-gray-600 mb-6">
              {product.status || "Stock: Not specified"}
            </div>

            {/* Add to Cart Button */}
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-6 rounded-lg mb-8 flex items-center justify-center gap-2 transition-colors text-lg">
              <ShoppingCart size={24} />
              Add to Cart
            </button>

            {/* Collapsible Sections */}
            <div className="space-y-4">
              {/* Product Details Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("details")}
                  className="w-full flex items-center justify-between py-4 px-6 text-left hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-900 text-lg">
                    Product Details
                  </span>
                  <ChevronDown
                    size={24}
                    className={`transform transition-transform ${
                      expandedSection === "details" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedSection === "details" && (
                  <div className="px-6 pb-4 border-t border-gray-200 text-base text-gray-700 leading-relaxed">
                    {product.description ||
                      "No description available for this product."}
                  </div>
                )}
              </div>

              {/* Specifications Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("specs")}
                  className="w-full flex items-center justify-between py-4 px-6 text-left hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-900 text-lg">
                    Specifications
                  </span>
                  <ChevronDown
                    size={24}
                    className={`transform transition-transform ${
                      expandedSection === "specs" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedSection === "specs" && (
                  <div className="px-6 pb-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      {specifications.map((spec, idx) => (
                        <div key={idx} className="flex flex-col">
                          <span className="text-gray-600 text-sm font-medium">
                            {spec.label}
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Compatibility Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("compatibility")}
                  className="w-full flex items-center justify-between py-4 px-6 text-left hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-900 text-lg">
                    Compatibility
                  </span>
                  <ChevronDown
                    size={24}
                    className={`transform transition-transform ${
                      expandedSection === "compatibility" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedSection === "compatibility" && (
                  <div className="px-6 pb-4 border-t border-gray-200">
                    <p className="text-base text-gray-700 mb-4">
                      This part is compatible with the following vehicles:
                    </p>
                    <ul className="space-y-2">
                      {compatibility.map((vehicle, idx) => (
                        <li
                          key={idx}
                          className="text-base text-gray-700 flex items-start"
                        >
                          <span className="mr-3">•</span>
                          <span>{vehicle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products - Desktop */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Related Products You Might Like
          </h2>

          <div className="grid grid-cols-4 gap-6">
            {relatedProducts.map((product, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-gray-100 rounded-lg p-6 mb-4 h-48 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    {product.name}
                  </h3>
                  <div className="inline-block bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded mb-3">
                    {product.badge}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {product.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden max-w-md mx-auto">
        {/* Back Button */}
        <div className="px-4 py-3 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-yellow-500 hover:text-yellow-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs text-gray-500">
            {product.category || "Categories"} › {product.name || "Product"}
          </span>
        </div>

        {/* Main Image */}
        <div className="px-4">
          <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
            <img
              src={images[selectedImage]}
              alt={product.name || "Product"}
              className="w-64 h-64 object-contain"
            />
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-2 mt-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === idx
                    ? "border-yellow-500"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover bg-gray-100"
                />
              </button>
            ))}
          </div>

          {/* Product Info */}
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {product.name || "Product Name"}
            </h1>

            <div className="inline-block bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded mt-2">
              ⭐ Verified by Xpress AutoZone
            </div>

            <div className="text-4xl font-bold text-gray-900 mt-3">
              GH₵{(product.price || 0).toFixed(2)}
            </div>

            <div className="text-sm text-gray-600 mt-2">
              {product.status || "Stock: Not specified"}
            </div>

            {/* Add to Cart Button */}
            <button className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg mt-4 flex items-center justify-center gap-2 transition-colors">
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>

          {/* Product Details Section */}
          <div className="mt-6 border-t border-gray-200">
            <button
              onClick={() => toggleSection("details")}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="font-semibold text-gray-900">
                Product Details
              </span>
              <ChevronDown
                size={20}
                className={`transform transition-transform ${
                  expandedSection === "details" ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSection === "details" && (
              <div className="pb-4 text-sm text-gray-700 leading-relaxed">
                {product.description ||
                  "No description available for this product."}
              </div>
            )}
          </div>

          {/* Specifications Section */}
          <div className="border-t border-gray-200">
            <button
              onClick={() => toggleSection("specs")}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="font-semibold text-gray-900">
                Specifications
              </span>
              <ChevronDown
                size={20}
                className={`transform transition-transform ${
                  expandedSection === "specs" ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSection === "specs" && (
              <div className="pb-4">
                {specifications.map((spec, idx) => (
                  <div key={idx} className="flex justify-between py-2 text-sm">
                    <span className="text-gray-600">{spec.label}</span>
                    <span className="text-gray-900 font-medium">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Compatibility Section */}
          <div className="border-t border-gray-200">
            <button
              onClick={() => toggleSection("compatibility")}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="font-semibold text-gray-900">Compatibility</span>
              <ChevronDown
                size={20}
                className={`transform transition-transform ${
                  expandedSection === "compatibility" ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSection === "compatibility" && (
              <div className="pb-4">
                <p className="text-sm text-gray-700 mb-3">
                  This part is compatible with the following vehicles:
                </p>
                <ul className="space-y-2">
                  {compatibility.map((vehicle, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-700 flex items-start"
                    >
                      <span className="mr-2">•</span>
                      <span>{vehicle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Related Products - Mobile */}
          <div className="mt-8 pb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Related Products You
              <br />
              Might Like
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {relatedProducts.map((product, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="bg-gray-100 rounded-lg p-4 mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-contain"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="inline-block bg-yellow-400 text-black text-xs font-semibold px-2 py-0.5 rounded mb-2">
                    {product.badge}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {product.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveProductPage;
