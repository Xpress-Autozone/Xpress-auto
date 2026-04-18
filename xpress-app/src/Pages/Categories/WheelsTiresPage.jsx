import React from "react";
import slideImage from "../../assets/wheels-tires.webp";
import CategoryPage from "./CategoryPage";

export default function WheelsTiresPage() {
  return (
    <CategoryPage
      title="Wheels & Tires"
      categoryQuery="wheels-tires"
      heroImage={slideImage}
      heroDescription="Premium wheels and tires for every vehicle and driving condition."
    />
  );
}
