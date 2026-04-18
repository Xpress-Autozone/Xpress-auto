import React from "react";
import slideImage from "../../assets/lighting-electronics.webp";
import CategoryPage from "./CategoryPage";

export default function LightingElectronicsPage() {
  return (
    <CategoryPage
      title="Lighting & Electronics"
      categoryQuery="lighting-electronics"
      heroImage={slideImage}
      heroDescription="Advanced lighting and electronic solutions for your vehicle."
    />
  );
}
