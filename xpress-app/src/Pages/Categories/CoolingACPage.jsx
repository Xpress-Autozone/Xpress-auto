import React from "react";
import slideImage from "../../assets/coolingHero.jpg";
import CategoryPage from "./CategoryPage";

export default function CoolingACPage() {
  return (
    <CategoryPage
      title="Cooling & AC"
      categoryQuery="cooling-ac"
      heroImage={slideImage}
      heroDescription="High-performance cooling systems and air conditioning components to keep your vehicle at optimal temperature."
      partTypeFilters={[
        "Radiators",
        "Condensers",
        "Compressors",
        "Cooling Fans",
        "Thermostats",
        "AC Kits"
      ]}
      brandFilters={["Denso", "Valeo", "Mishimoto", "Spectra", "Four Seasons"]}
    />
  );
}
