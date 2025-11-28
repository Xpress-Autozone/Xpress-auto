import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home/home";
import Navbar from "../Components/Navbar/navBar";
import Footer from "../Components/Footer/footer";
import ProductsPage from "../Pages/Product/productPage";
import CategoriesPage from "../Pages/Categories/categoriesPage";
import CartPage from "../Pages/Cart/cartPage";
import ActiveProductPage from "../Components/ActiveProductPage/activeProductPage";
import EnginePartsPage from "../Pages/Categories/enginePartsPage";
import SuspensionSteeringPage from "../Pages/Categories/suspensionSteeringPage";
import TiresWheelsPage from "../Pages/Categories/tiresWheelsPage";
import ElectricalComponentsPage from "../Pages/Categories/electricalComponentsPage";
import BrakesPage from "../Pages/Categories/brakesPage";
import ExhaustSystemsPage from "../Pages/Categories/exhaustSystemsPage";
import InteriorAccessoriesPage from "../Pages/Categories/interiorAccessoriesPage";
import ExteriorAccessoriesPage from "../Pages/Categories/exteriorAccessoriesPage";
import { useScrollToTop } from "../hooks/useScrollToTop";

function LayoutContent() {
  useScrollToTop();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/product" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ActiveProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/engine-parts" element={<EnginePartsPage />} />
        <Route
          path="/suspension-steering"
          element={<SuspensionSteeringPage />}
        />
        <Route path="/tires-wheels" element={<TiresWheelsPage />} />
        <Route
          path="/electrical-components"
          element={<ElectricalComponentsPage />}
        />
        <Route path="/brakes" element={<BrakesPage />} />
        <Route path="/exhaust-systems" element={<ExhaustSystemsPage />} />
        <Route
          path="/interior-accessories"
          element={<InteriorAccessoriesPage />}
        />
        <Route
          path="/exterior-accessories"
          element={<ExteriorAccessoriesPage />}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default function MainLayout() {
  return (
    <BrowserRouter basename="/">
      <LayoutContent />
    </BrowserRouter>
  );
}
