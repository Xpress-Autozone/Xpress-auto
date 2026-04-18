import React from "react";
import slideImage from "../../assets/engine-performance.webp";
import CategoryPage from "./CategoryPage";

export default function EnginePerformancePage() {
  return (
    <CategoryPage
      title="Engine & Performance"
      categoryQuery="engine-performance"
      heroImage={slideImage}
      heroDescription="High-performance engine components for maximum power and efficiency."
    />
  );
}
