import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn, fetchUserProfile } from "../../Redux/userSlice";
import SEO from "../../lib/SEOHelper";
import { getPageMetadata } from "../../data/pageMetadata";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signInAnonymously,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import { Info, Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, isOnboarded, isAuthInitialized } = useSelector((state) => state.user);

  // Determine if we are in login or signup mode based on the URL
  const isLoginPage = location.pathname === "/login";
  const metadata = getPageMetadata(isLoginPage ? "login" : "signup");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGuestInfo, setShowGuestInfo] = useState(false);
  const googleProvider = new GoogleAuthProvider();

  // Handle Redirect Result on Mount
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setLoading(true);
          const user = result.user;
          
          let onboardedStatus = false;
          const tokenResult = await user.getIdTokenResult(true);
          onboardedStatus = tokenResult.claims.isOnboarded || false;

          const userData = {
            uid: user.uid,
            name: user.displayName || "User",
            email: user.email,
            photoURL: user.photoURL,
            isOnboarded: onboardedStatus,
          };

          dispatch(signIn(userData));
          
          // Hydrate full profile from Firestore
          await dispatch(fetchUserProfile(user.uid));
          
          const from = location.state?.from?.pathname || (onboardedStatus === true ? "/account" : "/onboarding");
          navigate(from, { replace: true });
        }
      } catch (err) {
        console.error("Redirect Auth Error:", err);
        setError("Redirect authentication failed: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    handleRedirect();
  }, [dispatch, navigate]);

  React.useEffect(() => {
    if (isAuthInitialized && isAuthenticated) {
      const from = location.state?.from?.pathname || (isOnboarded ? "/" : "/onboarding");
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isOnboarded, isAuthInitialized, navigate, location.state]);

  const handleGuestSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Sign in anonymously with Firebase
      const result = await signInAnonymously(auth);
      const user = result.user;

      const userData = {
        uid: user.uid,
        name: "Guest User",
        email: "guest@example.com",
        isOnboarded: false,
        isAnonymous: true,
      };
      
      dispatch(signIn(userData));
      navigate("/onboarding");
    } catch (error) {
      console.error("Guest Auth Error:", error);
      setError("Guest sign-in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);

      // Set persistence to LOCAL so user stays signed in
      await setPersistence(auth, browserLocalPersistence);

      // Detect mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

      if (isMobile) {
        // Use redirect for mobile to avoid popup blockers
        await signInWithRedirect(auth, googleProvider);
      } else {
        // Sign in with Google popup for desktop
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        let onboardedStatus = false;

        if (user) {
          // Force refresh token to get latest claims
          const tokenResult = await user.getIdTokenResult(true);
          console.log("✓ Google login successful!");
          
          // Get isOnboarded status from custom claims
          onboardedStatus = tokenResult.claims.isOnboarded || false;
        }

        const userData = {
          uid: user.uid,
          name: user.displayName || "User",
          email: user.email,
          photoURL: user.photoURL,
          isOnboarded: onboardedStatus,
        };

        dispatch(signIn(userData));

        // Hydrate full profile from Firestore
        await dispatch(fetchUserProfile(user.uid));

        if (onboardedStatus === true) {
          navigate("/account");
        } else {
          navigate("/onboarding");
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setError("Authentication failed: " + error.message);
    } finally {
      // Don't set loading to false here if we are redirecting
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      if (!isMobile) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        ogUrl={metadata.url}
      />
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 border border-gray-100 flex flex-col items-center">
        {/* New 3D Mechanic Asset */}
        <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
            {/* Using white background for the image container to blend with card */}
            <img
            src="/assets/icons/mechanic_v2.png"
            alt="Xpress Mechanic"
            className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter">
          {isLoginPage ? "Sign In" : "Get Started"}
        </h2>
        <p className="mb-8 text-gray-500 text-sm font-medium">
          {isLoginPage 
            ? "Access your dashboard and manage your orders." 
            : "Create your profile and start shopping confidently."}
        </p>

        {error && (
          <div className="w-full mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg text-center animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="font-bold">Authentication Failed</span>
            </div>
            <p className="text-red-500 font-normal">{error}</p>
            <p className="text-red-400 text-[10px] mt-1">Please try again or contact support if the issue persists.</p>
          </div>
        )}

        <div className="w-full space-y-4">
            <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 text-black font-black uppercase italic tracking-widest text-xs py-4 px-4 rounded-xl transition-all transform hover:translate-y-[-2px] active:translate-y-[0] shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[52px]"
            >
            {loading ? (
                <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
                </>
            ) : (
                <>
                Continue with Google
                </>
            )}
            </button>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase font-black tracking-tighter italic">
                    <span className="px-4 bg-white text-gray-400">or</span>
                </div>
            </div>

            <div className="relative">
              <button
              onClick={handleGuestSignIn}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-xs py-4 px-4 rounded-xl transition-all border border-gray-200 min-h-[52px]"
              >
              Continue as Guest
              </button>
              <button
                onClick={() => setShowGuestInfo(!showGuestInfo)}
                className="absolute -right-8 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="What is guest access?"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            {showGuestInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[10px] text-blue-800 animate-in fade-in slide-in-from-top-2">
                <p className="font-semibold mb-1">Guest Access:</p>
                <p>Shop without creating an account. Your cart will be saved locally. Sign up anytime to sync across devices.</p>
              </div>
            )}
        </div>

        <p className="mt-8 text-xs text-gray-400 font-bold uppercase tracking-widest">
            {isLoginPage ? (
                <>New to Xpress? <span onClick={() => navigate('/signup')} className="text-yellow-600 cursor-pointer hover:underline">Register</span></>
            ) : (
                <>Have an account? <span onClick={() => navigate('/login')} className="text-yellow-600 cursor-pointer hover:underline">Sign In</span></>
            )}
        </p>
      </div>
    </div>
  );
};

export default Auth;
