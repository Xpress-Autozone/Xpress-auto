import React from "react";
import slideImage from "../../assets/fluids-care.webp";
import CategoryPage from "./CategoryPage";

export default function FluidsCarePage() {
  return (
    <CategoryPage
      title="Fluids & Car Care"
      categoryQuery="fluids-care"
      heroImage={slideImage}
      heroDescription="Essential fluids and care products to keep your vehicle running smoothly."
    />
  );
}
