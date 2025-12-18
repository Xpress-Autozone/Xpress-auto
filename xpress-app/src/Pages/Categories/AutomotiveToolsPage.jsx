import React from "react";
import slideImage from "../../assets/tools.jpg";
import CategoryPage from "./CategoryPage";

export default function AutomotiveToolsPage() {
  return (
    <CategoryPage
      title="Automotive Tools"
      categoryQuery="automotive tools equipment"
      heroImage={slideImage}
      heroDescription="Professional-grade tools for all your automotive needs."
      partTypeFilters={
        ["Tool Sets", "Diagnostic Tools", "Lifting Equipment", "Air Tools", "Hand Tools", "Cleaning Equipment"]
      }
      brandFilters={["Snap-on", "Craftsman", "DEWALT", "Milwaukee", "Harbor Freight"]}
    />
  );
}
