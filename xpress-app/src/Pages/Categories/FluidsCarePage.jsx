import React from "react";
import slideImage from "../../assets/fluids-care.jpg";
import CategoryPage from "./CategoryPage";

export default function FluidsCarePage() {
  return (
    <CategoryPage
      title="Fluids & Car Care"
      categoryQuery="fluids-care"
      heroImage={slideImage}
      heroDescription="Essential fluids and care products to keep your vehicle running smoothly."
      partTypeFilters={
        ["Motor Oil", "Transmission Fluid", "Coolant", "Brake Fluid", "Car Wash Kits", "Wax & Polish"]
      }
      brandFilters={["Mobil 1", "Castrol", "Valvoline", "Meguiar's", "Turtle Wax"]}
    />
  );
}
