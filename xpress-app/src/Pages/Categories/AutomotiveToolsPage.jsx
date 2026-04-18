import React from "react";
import slideImage from "../../assets/toolsHero.webp";
import CategoryPage from "./CategoryPage";

export default function AutomotiveToolsPage() {
  return (
    <CategoryPage
      title="Automotive Tools"
      categoryQuery="automotive-tools"
      heroImage={slideImage}
      heroDescription="Professional-grade tools for all your automotive needs."
    />
  );
}
