import React from "react";
import slideImage from "../../assets/engine-performance.jpg";
import CategoryPage from "./CategoryPage";

export default function EnginePerformancePage() {
  return (
    <CategoryPage
      title="Engine & Performance"
      categoryQuery="engine performance turbocharger"
      heroImage={slideImage}
      heroDescription="High-performance engine components for maximum power and efficiency."
      partTypeFilters={[
        "Spark Plugs",
        "Fuel Pumps",
        "Air Filters",
        "Turbochargers",
        "Superchargers",
        "ECU Tuning"
      ]}
      brandFilters={["Bosch", "NGK", "K&N", "Garrett", "HKS"]}
    />
  );
}
