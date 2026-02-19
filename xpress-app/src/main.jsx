import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainLayout from "./MainLayout/mainLayout";
import { CartProvider } from "./Context/CartContext";
import { Provider } from 'react-redux';
import { store } from './Redux/store';

import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <CartProvider>
          <MainLayout />
        </CartProvider>
      </Provider>
    </HelmetProvider>
  </StrictMode>
);
