import React from "react";
import slideImage from "../../assets/wheels-tires.jpg";
import CategoryPage from "./CategoryPage";

export default function WheelsTiresPage() {
  return (
    <CategoryPage
      title="Wheels & Tires"
      categoryQuery="wheels tires rims"
      heroImage={slideImage}
      heroDescription="Premium wheels and tires for every vehicle and driving condition."
      partTypeFilters={[
        "All-Season Tires",
        "Winter Tires",
        "Performance Tires",
        "Alloy Wheels",
        "Steel Wheels",
        "Tire & Wheel Packages"
      ]}
      brandFilters={["Michelin", "Bridgestone", "Goodyear", "American Racing", "Enkei"]}
    />
  );
}
