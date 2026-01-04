import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "../Pages/Home/home";
import Navbar from "../Components/Navbar/navBar";
import Footer from "../Components/Footer/footer";
import ProductsPage from "../Pages/Product/productPage";
import CategoriesPage from "../Pages/Categories/categoriesPage";
import CartPage from "../Pages/Cart/cartPage";
import ActiveProductPage from "../Components/ActiveProductPage/activeProductPage";
import SearchResultsPage from "../Pages/Search/searchResultsPage";
import SkeletonLoader from "../Components/SkeletonLoader/skeletonLoader";

// Lazy load category pages
const BodyChassisPage = lazy(() => import("../Pages/Categories/BodyChassisPage"));
const EnginePerformancePage = lazy(() => import("../Pages/Categories/EnginePerformancePage"));
const WheelsTiresPage = lazy(() => import("../Pages/Categories/WheelsTiresPage"));
const AccessoriesPage = lazy(() => import("../Pages/Categories/AccessoriesPage"));
const LightingElectronicsPage = lazy(() => import("../Pages/Categories/LightingElectronicsPage"));
const FluidsCarePage = lazy(() => import("../Pages/Categories/FluidsCarePage"));
const AutomotiveToolsPage = lazy(() => import("../Pages/Categories/AutomotiveToolsPage"));
const CoolingACPage = lazy(() => import("../Pages/Categories/CoolingACPage"));

// Lazy load other pages
const PrivacyPolicy = lazy(() => import("../Pages/PrivacyPolicy/privacyPolicy"));
const TermsOfService = lazy(() => import("../Pages/TermsOfService/termsOfService"));
const XplorePage = lazy(() => import("../Pages/Xplore/xplore"));
const FeaturedProducts = lazy(() => import("../Pages/Xplore/FeaturedProducts/featuredProducts"));
const TrendingProducts = lazy(() => import("../Pages/Xplore/TrendingProducts/trendingProducts"));
const NewProducts = lazy(() => import("../Pages/Xplore/NewProducts/newProducts"));
const SignIn = lazy(() => import("../Pages/Auth/SignIn"));
const SignUp = lazy(() => import("../Pages/Auth/SignUp"));
const MyAccount = lazy(() => import("../Pages/Account/MyAccount"));
const Partner = lazy(() => import("../Pages/Partner/Partner"));

import { useScrollToTop } from "../hooks/useScrollToTop";

function LayoutContent() {
  useScrollToTop();

  return (
    <>
      <Navbar />
      <Suspense fallback={<SkeletonLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/product" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ActiveProductPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/cart" element={<CartPage />} />
          {/* Lazy-loaded Category Routes */}
          <Route path="/body-chassis" element={<BodyChassisPage />} />
          <Route path="/engine-performance" element={<EnginePerformancePage />} />
          <Route path="/wheels-tires" element={<WheelsTiresPage />} />
          <Route path="/accessories" element={<AccessoriesPage />} />
          <Route path="/lighting-electronics" element={<LightingElectronicsPage />} />
          <Route path="/fluids-care" element={<FluidsCarePage />} />
          <Route path="/automotive-tools" element={<AutomotiveToolsPage />} />
          <Route path="/cooling-ac" element={<CoolingACPage />} />
          {/* Lazy-loaded Legal Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          {/* Lazy-loaded Xplore Routes */}
          <Route path="/xplore" element={<XplorePage />} />
          <Route path="/xplore/featured" element={<FeaturedProducts />} />
          <Route path="/xplore/trending" element={<TrendingProducts />} />
          <Route path="/xplore/new" element={<NewProducts />} />
          {/* Lazy-loaded Auth Routes */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/partner" element={<Partner />} />
        </Routes>
      </Suspense>
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
