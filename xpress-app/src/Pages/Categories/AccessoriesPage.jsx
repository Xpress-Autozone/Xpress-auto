import React from "react";
import slideImage from "../../assets/accessories.jpg";
import CategoryPage from "./CategoryPage";

export default function AccessoriesPage() {
  return (
    <CategoryPage
      title="Interior & Exterior Accessories"
      categoryQuery="car accessories"
      heroImage={slideImage}
      heroDescription="Enhance your vehicle's comfort, style, and functionality."
      partTypeFilters={[
        "Seat Covers",
        "Floor Mats",
        "Car Covers",
        "Hitch & Towing",
        "Roof Racks",
        "Window Visors"
      ]}
      brandFilters={["WeatherTech", "Husky", "Covercraft", "Thule", "Yakima"]}
    />
  );
}
