import React from "react";

export default function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-17">
      {/* Hero Image Skeleton */}
      <div className="max-w-7xl mx-auto mb-12 px-4">
        <div className="relative h-34 md:h-30 lg:h-100 w-full overflow-hidden rounded-lg bg-gray-300 animate-pulse"></div>
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
                  className="bg-white rounded-lg overflow-hidden animate-pulse"
                >
                  {/* Image Skeleton */}
                  <div className="aspect-[4/5] bg-gray-300 rounded-t"></div>

                  {/* Content Skeleton */}
                  <div className="p-3 md:p-4">
                    {/* Title Skeleton */}
                    <div className="space-y-2 mb-3">
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                    </div>

                    {/* Verified Badge Skeleton */}
                    <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>

                    {/* Price and Status Skeleton */}
                    <div className="flex items-center justify-between">
                      <div className="h-6 w-20 bg-gray-300 rounded"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded"></div>
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
