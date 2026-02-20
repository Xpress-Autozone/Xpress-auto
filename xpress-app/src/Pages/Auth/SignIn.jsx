import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn } from "../../Redux/userSlice";
import SEO from "../../lib/SEOHelper";
import { getPageMetadata } from "../../data/pageMetadata";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { app } from "../../Firebase/firebase";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const metadata = getPageMetadata("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const handleSignIn = () => {
    // Simulating a login - normally this would be an API call
    const userData = {
      name: "Guest User",
      email: "guest@example.com",
      isOnboarded: false, // New users start as not onboarded
    };
    dispatch(signIn(userData));

    // Redirect based on onboarding status
    if (userData.isOnboarded) {
      navigate("/cart");
    } else {
      navigate("/onboarding");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);

      // Set persistence to LOCAL so user stays signed in
      await setPersistence(auth, browserLocalPersistence);

      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      let isOnboarded = false;

      if (user) {
        // Force refresh token to get latest claims
        const tokenResult = await user.getIdTokenResult(true);
        console.log("ID Token:", tokenResult.token);
        console.log("Token Claims:", tokenResult.claims);

        // Get isOnboarded status from custom claims
        isOnboarded = tokenResult.claims.isOnboarded || false;
      }

      const userData = {
        uid: user.uid,
        name: user.displayName || "Google User",
        email: user.email,
        photoURL: user.photoURL,
        isOnboarded: isOnboarded,
      };

      dispatch(signIn(userData));
      console.log("✓ Google login successful!");
      console.log("User data:", userData);

      if (isOnboarded === true) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError("Failed to log in with Google: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center pt-20">
      <SEO
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        ogUrl={metadata.url}
        ogImage={metadata.ogImage}
        ogType={metadata.ogType}
        canonicalUrl={metadata.url}
      />
      <div className="max-w-md w-full text-center p-8">
        <img
          src="/assets/icons/parts.png"
          alt="Sign In Icon"
          className="mx-auto h-24 w-auto mb-6"
        />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Sign In</h2>
        <p className="mb-8 text-gray-600">
          Sign in to continue to your cart and enjoy a seamless shopping
          experience.
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-black font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In with Google"}
        </button>

        <div className="mt-6 pt-6 border-t border-gray-300">
          <button
            onClick={handleSignIn}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
