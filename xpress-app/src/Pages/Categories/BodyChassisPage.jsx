import React from "react";
import slideImage from "../../assets/body-chassis.jpg";
import CategoryPage from "./CategoryPage";

export default function BodyChassisPage() {
  return (
    <CategoryPage
      title="Body & Parts"
      categoryQuery="body chassis suspension brakes"
      heroImage={slideImage}
      heroDescription="Premium body, steering, suspension, brake and chassis components for safety and performance."
      partTypeFilters={[
        "Brake Systems",
        "Suspension Kits",
        "Control Arms",
        "Bushings",
        "Body Panels",
        "Bumpers"
      ]}
      brandFilters={["Brembo", "Monroe", "KYB", "Moog", "ACDelco"]}
    />
  );
}
