import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home/home";
import Navbar from "../Components/Navbar/navBar";
import Footer from "../Components/Footer/footer";
import ProductsPage from "../Pages/Product/productPage";
import CategoriesPage from "../Pages/Categories/categoriesPage";
import CartPage from "../Pages/Cart/cartPage";
import ActiveProductPage from "../Components/ActiveProductPage/activeProductPage";
import SearchResultsPage from "../Pages/Search/searchResultsPage";

// Import new category pages
import BodyChassisPage from "../Pages/Categories/BodyChassisPage";
import EnginePerformancePage from "../Pages/Categories/EnginePerformancePage";
import WheelsTiresPage from "../Pages/Categories/WheelsTiresPage";
import AccessoriesPage from "../Pages/Categories/AccessoriesPage";
import LightingElectronicsPage from "../Pages/Categories/LightingElectronicsPage";
import FluidsCarePage from "../Pages/Categories/FluidsCarePage";
import AutomotiveToolsPage from "../Pages/Categories/AutomotiveToolsPage";
import CoolingACPage from "../Pages/Categories/CoolingACPage";

import PrivacyPolicy from "../Pages/PrivacyPolicy/privacyPolicy";
import TermsOfService from "../Pages/TermsOfService/termsOfService";
import XplorePage from "../Pages/Xplore/xplore";
import FeaturedProducts from "../Pages/Xplore/FeaturedProducts/featuredProducts";
import TrendingProducts from "../Pages/Xplore/TrendingProducts/trendingProducts";
import NewProducts from "../Pages/Xplore/NewProducts/newProducts";
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
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/cart" element={<CartPage />} />
        {/* Updated Category Routes */}
        <Route path="/body-chassis" element={<BodyChassisPage />} />
        <Route path="/engine-performance" element={<EnginePerformancePage />} />
        <Route path="/wheels-tires" element={<WheelsTiresPage />} />
        <Route path="/accessories" element={<AccessoriesPage />} />
        <Route path="/lighting-electronics" element={<LightingElectronicsPage />} />
        <Route path="/fluids-care" element={<FluidsCarePage />} />
        <Route path="/automotive-tools" element={<AutomotiveToolsPage />} />
        <Route path="/cooling-ac" element={<CoolingACPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/xplore" element={<XplorePage />} />
        <Route path="/xplore/featured" element={<FeaturedProducts />} />
        <Route path="/xplore/trending" element={<TrendingProducts />} />
        <Route path="/xplore/new" element={<NewProducts />} />
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
