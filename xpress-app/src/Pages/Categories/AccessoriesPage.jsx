import React from "react";
import slideImage from "../../assets/accessories.webp";
import CategoryPage from "./CategoryPage";

export default function AccessoriesPage() {
  return (
    <CategoryPage
      title="Interior & Exterior Accessories"
      categoryId="Accessories"
      categoryQuery="accessories"
      heroImage={slideImage}
      heroDescription="Enhance your vehicle's comfort, style, and functionality."
    />
  );
}
