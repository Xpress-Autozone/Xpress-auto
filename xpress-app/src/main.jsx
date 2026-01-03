import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainLayout from "./MainLayout/mainLayout";
import { CartProvider } from "./Context/CartContext";
import { SearchProvider } from "./Context/SearchContext";
import { Provider } from 'react-redux';
import { store } from './Redux/store';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SearchProvider>
        <CartProvider>
          <MainLayout />
        </CartProvider>
      </SearchProvider>
    </Provider>
  </StrictMode>
);
