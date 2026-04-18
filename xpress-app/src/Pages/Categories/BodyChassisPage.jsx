import React from "react";
import slideImage from "../../assets/body-chassis.webp";
import CategoryPage from "./CategoryPage";

export default function BodyChassisPage() {
  return (
    <CategoryPage
      title="Body & Parts"
      categoryQuery="body-chassis"
      heroImage={slideImage}
      heroDescription="Premium body, steering, suspension, brake and chassis components for safety and performance."
    />
  );
}
