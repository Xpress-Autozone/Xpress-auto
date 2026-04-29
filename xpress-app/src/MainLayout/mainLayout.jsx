import React, { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { signIn, signOut, authLoaded, fetchUserProfile, fetchUserOrders } from "../Redux/userSlice";
import Navbar from "../Components/Navbar/navBar";
import Footer from "../Components/Footer/footer";
import WhatsAppButton from "../Components/WhatsApp/WhatsAppButton";
import { useScrollToTop } from "../hooks/useScrollToTop";
import ProtectedRoute from "../Components/Auth/ProtectedRoute";

// Lazy load pages
const Home = React.lazy(() => import("../Pages/Home/home"));
const ProductsPage = React.lazy(() => import("../Pages/Product/productPage"));
const CategoriesPage = React.lazy(() => import("../Pages/Categories/categoriesPage"));
const CartPage = React.lazy(() => import("../Pages/Cart/cartPage"));
const ActiveProductPage = React.lazy(() => import("../Components/ActiveProductPage/activeProductPage"));
const SearchResultsPage = React.lazy(() => import("../Pages/Search/searchResultsPage"));
const BodyChassisPage = React.lazy(() => import("../Pages/Categories/BodyChassisPage"));
const EnginePerformancePage = React.lazy(() => import("../Pages/Categories/EnginePerformancePage"));
const WheelsTiresPage = React.lazy(() => import("../Pages/Categories/WheelsTiresPage"));
const AccessoriesPage = React.lazy(() => import("../Pages/Categories/AccessoriesPage"));
const LightingElectronicsPage = React.lazy(() => import("../Pages/Categories/LightingElectronicsPage"));
const FluidsCarePage = React.lazy(() => import("../Pages/Categories/FluidsCarePage"));
const AutomotiveToolsPage = React.lazy(() => import("../Pages/Categories/AutomotiveToolsPage"));
const CoolingACPage = React.lazy(() => import("../Pages/Categories/CoolingACPage"));
const PrivacyPolicy = React.lazy(() => import("../Pages/PrivacyPolicy/privacyPolicy"));
const TermsOfService = React.lazy(() => import("../Pages/TermsOfService/termsOfService"));
const CookiePolicy = React.lazy(() => import("../Pages/CookiePolicy/cookiePolicy"));
const XplorePage = React.lazy(() => import("../Pages/Xplore/xplore"));
const FeaturedProducts = React.lazy(() => import("../Pages/Xplore/FeaturedProducts/featuredProducts"));
const TrendingProducts = React.lazy(() => import("../Pages/Xplore/TrendingProducts/trendingProducts"));
const NewProducts = React.lazy(() => import("../Pages/Xplore/NewProducts/newProducts"));
const Auth = React.lazy(() => import("../Pages/Auth/Auth"));
const MyAccount = React.lazy(() => import("../Pages/Account/MyAccount"));
const Partner = React.lazy(() => import("../Pages/Partner/Partner"));
const FeedbackPage = React.lazy(() => import("../Pages/Feedback/FeedbackPage"));
const Onboarding = React.lazy(() => import("../Pages/Auth/Onboarding"));

// Simple premium loader
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] w-full">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 animate-pulse">Loading Xpress...</p>
    </div>
  </div>
);

function LayoutContent() {
  const dispatch = useDispatch();
  useScrollToTop();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Basic user data to start with
        dispatch(signIn({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
        }));
        // Fetch full profile and orders
        dispatch(fetchUserProfile(user.uid));
        dispatch(fetchUserOrders());
      } else {
        // Firebase signed the user out (token revocation, session expiry, etc.)
        dispatch(signOut());
      }
      // Signal that we've checked auth state (first time)
      dispatch(authLoaded());
    });

    // Poll for order updates every 2 minutes
    const pollInterval = setInterval(() => {
      if (auth.currentUser) {
        dispatch(fetchUserOrders());
      }
    }, 120000);

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/product" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ActiveProductPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/cart" element={<CartPage />} />
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
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/xplore" element={<XplorePage />} />
          <Route path="/xplore/featured" element={<FeaturedProducts />} />
          <Route path="/xplore/trending" element={<TrendingProducts />} />
          <Route path="/xplore/new" element={<NewProducts />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <MyAccount />
              </ProtectedRoute>
            }
          />
          <Route path="/partner" element={<Partner />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
      </Suspense>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function MainLayout() {
  return (
    <LayoutContent />
  );
}
