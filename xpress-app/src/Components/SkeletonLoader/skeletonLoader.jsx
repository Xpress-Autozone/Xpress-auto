import React from "react";

export default function SkeletonLoader({ type = "list" }) {
  if (type === "product") {
    return (
      <div className="min-h-screen bg-white pt-24 pb-20 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          {/* BREADCRUMB & BACK SKELETON */}
          <div className="mb-10 flex items-center justify-between">
            <div className="h-4 w-32 bg-gray-100 rounded"></div>
            <div className="hidden md:block h-4 w-64 bg-gray-50 rounded"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* LEFT: IMAGE SUITE SKELETON */}
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-100 h-[500px] w-full rounded"></div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-50 border border-gray-100 rounded"></div>
                ))}
              </div>
            </div>

            {/* RIGHT: PRODUCT DATA SKELETON */}
            <div className="flex flex-col space-y-8">
              <div>
                <div className="h-4 w-40 bg-green-50 rounded mb-4"></div>
                <div className="h-10 md:h-12 w-full bg-gray-100 rounded mb-4"></div>
                <div className="h-6 w-3/4 bg-gray-100 rounded mb-6"></div>
                
                <div className="flex items-baseline gap-4 mt-8">
                  <div className="h-8 w-32 bg-gray-100 rounded italic"></div>
                  <div className="h-6 w-24 bg-gray-50 border border-gray-100 rounded"></div>
                </div>
              </div>

              {/* CTA SKELETON */}
              <div className="h-14 w-full bg-gray-100 rounded"></div>

              {/* TAGS SKELETON */}
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-24 bg-gray-50 rounded"></div>
                ))}
              </div>

              {/* STATIC INFO SKELETON */}
              <div className="border-t border-gray-100 mt-8 space-y-10 pt-8">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-4 w-32 bg-gray-100 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-50 rounded"></div>
                      <div className="h-4 w-5/6 bg-gray-50 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RELATED PRODUCTS SKELETON */}
          <div className="mt-32">
            <div className="mb-10 border-b-2 border-gray-100 pb-4 h-10 w-64 bg-gray-50 rounded"></div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-50 rounded overflow-hidden">
                  <div className="aspect-square bg-gray-50"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-16 bg-yellow-50 rounded"></div>
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-5 w-20 bg-gray-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default List/Category View Skeleton
  return (
    <div className="min-h-screen bg-white py-17 border-t border-gray-100">
      {/* Hero Image Skeleton */}
      <div className="max-w-7xl mx-auto mb-12 px-4 md:px-6">
        <div className="relative h-[450px] md:h-[550px] w-full overflow-hidden bg-gray-50 animate-pulse border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>

      {/* Header Controls Skeleton */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="md:hidden mb-4 flex gap-2">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
            <div className="hidden md:block h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse ml-auto"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Sidebar Filters Skeleton - Hidden on mobile */}
          <div className="hidden md:block md:w-80 md:flex-shrink-0">
            <div className="bg-white p-6 rounded-lg">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-6"></div>

              {/* Filter Sections */}
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="border-b border-gray-200 py-4">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((sub) => (
                      <div
                        key={sub}
                        className="h-4 w-full bg-gray-200 rounded animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="bg-white border border-gray-100 overflow-hidden animate-pulse"
                >
                  {/* Image Skeleton */}
                  <div className="aspect-[4/5] bg-gray-50"></div>

                  {/* Content Skeleton */}
                  <div className="p-3 md:p-4">
                    {/* Title Skeleton */}
                    <div className="space-y-2 mb-3">
                      <div className="h-4 w-full bg-gray-100 rounded"></div>
                      <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                    </div>

                    {/* Verified Badge Skeleton */}
                    <div className="h-3 w-20 bg-yellow-50 rounded mb-3"></div>

                    {/* Price and Status Skeleton */}
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-16 bg-gray-100 rounded"></div>
                      <div className="h-5 w-16 bg-gray-50 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
