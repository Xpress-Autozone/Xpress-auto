import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainLayout from "./MainLayout/mainLayout";
import { CartProvider } from "./Context/CartContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <MainLayout />
    </CartProvider>
  </StrictMode>
);
