import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainLayout from "./MainLayout/mainLayout";
import { CartProvider } from "./Context/CartContext";
import { Provider } from 'react-redux';
import { store } from './Redux/store';

import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <HelmetProvider>
        <Provider store={store}>
          <CartProvider>
            <MainLayout />
            <Toaster
              position="bottom-center"
              toastOptions={{
                className: 'bg-[#1a1a1a]/95 text-white border border-white/10 backdrop-blur-md rounded-none font-medium tracking-tight',
                duration: 5000,
                style: {
                  borderRadius: '0px',
                  background: 'rgba(26, 26, 26, 0.95)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(12px)',
                },
              }}
            />
          </CartProvider>
        </Provider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);
