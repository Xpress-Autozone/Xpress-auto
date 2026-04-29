import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn, fetchUserProfile, authLoaded } from "../../Redux/userSlice";
import SEO from "../../lib/SEOHelper";
import { getPageMetadata } from "../../data/pageMetadata";
import {
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signInAnonymously,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import { Info, Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft, User } from "lucide-react";

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
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const googleProvider = new GoogleAuthProvider();

  // Email/password form state
  const [emailForm, setEmailForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });

  // Removed getRedirectResult listener as we now use signInWithPopup universally

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
        email: null,
        isOnboarded: false,
        isAnonymous: true,
      };
      
      dispatch(signIn(userData));
      dispatch(authLoaded());
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
      // CLEAR ERRORS AND SET LOADING IN THE BACKGROUND
      setError("");
      setLoading(true);

      // CRITICAL iOS FIX: signInWithPopup MUST be the very first asynchronous operation.
      // If we await anything else before this (like setPersistence), iPhones will block the popup.
      // Firebase automatically uses local persistence on the web by default anyway.
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
      dispatch(authLoaded());

      // Hydrate full profile from Firestore
      await dispatch(fetchUserProfile(user.uid));

      if (onboardedStatus === true) {
        navigate("/account");
      } else {
        navigate("/onboarding");
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setError("Authentication failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Email / Password Handlers ────────────────────────────

  const handleEmailInputChange = (e) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const getFirebaseErrorMessage = (code) => {
    const messages = {
      "auth/email-already-in-use": "An account with this email already exists. Try signing in instead.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/user-not-found": "No account found with this email. Try registering instead.",
      "auth/wrong-password": "Incorrect password. Please try again or reset it.",
      "auth/invalid-credential": "Invalid email or password. Please check and try again.",
      "auth/too-many-requests": "Too many failed attempts. Please wait a moment and try again.",
      "auth/user-disabled": "This account has been disabled. Contact support for help.",
      "auth/network-request-failed": "Network error. Please check your connection.",
    };
    return messages[code] || "Something went wrong. Please try again.";
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailForm.email || !emailForm.password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      await setPersistence(auth, browserLocalPersistence);

      const result = await signInWithEmailAndPassword(auth, emailForm.email, emailForm.password);
      const user = result.user;

      const tokenResult = await user.getIdTokenResult(true);
      const onboardedStatus = tokenResult.claims.isOnboarded || false;
      console.log("✓ Email login successful!");

      const userData = {
        uid: user.uid,
        name: user.displayName || user.email.split("@")[0],
        email: user.email,
        photoURL: user.photoURL,
        isOnboarded: onboardedStatus,
      };

      dispatch(signIn(userData));
      dispatch(authLoaded());
      await dispatch(fetchUserProfile(user.uid));

      if (onboardedStatus) {
        navigate("/account");
      } else {
        navigate("/onboarding");
      }
    } catch (error) {
      console.error("Email Sign-In Error:", error);
      setError(getFirebaseErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailForm.email || !emailForm.password || !emailForm.displayName) {
      setError("Please fill in all fields.");
      return;
    }

    if (emailForm.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (emailForm.password !== emailForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await setPersistence(auth, browserLocalPersistence);

      const result = await createUserWithEmailAndPassword(auth, emailForm.email, emailForm.password);
      const user = result.user;

      // Set the display name on the Firebase Auth profile
      await updateProfile(user, { displayName: emailForm.displayName });
      console.log("✓ Email registration successful!");

      const userData = {
        uid: user.uid,
        name: emailForm.displayName,
        email: user.email,
        photoURL: null,
        isOnboarded: false,
      };

      dispatch(signIn(userData));
      dispatch(authLoaded());
      navigate("/onboarding");
    } catch (error) {
      console.error("Email Sign-Up Error:", error);
      setError(getFirebaseErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailForm.email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, emailForm.email);
      setResetEmailSent(true);
    } catch (error) {
      console.error("Password Reset Error:", error);
      setError(getFirebaseErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        ogUrl={metadata.url}
      />
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 border border-gray-100 flex flex-col items-center">
        {/* 3D Mechanic Asset */}
        {!showEmailForm && (
          <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
            <img
              src="/assets/icons/mechanic_v2.png"
              alt="Xpress Mechanic"
              className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter">
          {showForgotPassword
            ? "Reset Password"
            : showEmailForm
              ? (isLoginPage ? "Sign In" : "Create Account")
              : (isLoginPage ? "Sign In" : "Get Started")}
        </h2>
        <p className="mb-8 text-gray-500 text-sm font-medium text-center">
          {showForgotPassword
            ? "Enter your email and we'll send a reset link."
            : showEmailForm
              ? (isLoginPage
                ? "Sign in with your email and password."
                : "Set up your email and password to get started.")
              : (isLoginPage
                ? "Access your dashboard and manage your orders."
                : "Create your profile and start shopping confidently.")}
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

        {/* ─── Forgot Password View ─── */}
        {showForgotPassword ? (
          <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {resetEmailSent ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm font-bold text-gray-900">Check your inbox</p>
                <p className="text-xs text-gray-500">
                  We've sent a password reset link to <span className="font-bold text-gray-700">{emailForm.email}</span>. 
                  It may take a minute to arrive.
                </p>
                <button
                  onClick={() => { setShowForgotPassword(false); setResetEmailSent(false); }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-4 rounded-xl transition-all"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={emailForm.email}
                    onChange={handleEmailInputChange}
                    className="w-full border-2 border-gray-200 focus:border-gray-900 pl-12 pr-4 py-4 text-sm font-bold outline-none rounded-xl transition-colors"
                    required
                    autoComplete="email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 text-black font-black uppercase italic tracking-widest text-xs py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[52px]"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(false); setError(""); }}
                  className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 text-xs font-bold py-2 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to sign in
                </button>
              </form>
            )}
          </div>

        /* ─── Email/Password Form ─── */
        ) : showEmailForm ? (
          <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <form onSubmit={isLoginPage ? handleEmailSignIn : handleEmailSignUp} className="space-y-3">
              
              {/* Display name — signup only */}
              {!isLoginPage && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="displayName"
                    placeholder="Full name"
                    value={emailForm.displayName}
                    onChange={handleEmailInputChange}
                    className="w-full border-2 border-gray-200 focus:border-gray-900 pl-12 pr-4 py-4 text-sm font-bold outline-none rounded-xl transition-colors"
                    required
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={emailForm.email}
                  onChange={handleEmailInputChange}
                  className="w-full border-2 border-gray-200 focus:border-gray-900 pl-12 pr-4 py-4 text-sm font-bold outline-none rounded-xl transition-colors"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={emailForm.password}
                  onChange={handleEmailInputChange}
                  className="w-full border-2 border-gray-200 focus:border-gray-900 pl-12 pr-12 py-4 text-sm font-bold outline-none rounded-xl transition-colors"
                  required
                  minLength={6}
                  autoComplete={isLoginPage ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Confirm password — signup only */}
              {!isLoginPage && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={emailForm.confirmPassword}
                    onChange={handleEmailInputChange}
                    className="w-full border-2 border-gray-200 focus:border-gray-900 pl-12 pr-4 py-4 text-sm font-bold outline-none rounded-xl transition-colors"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              )}

              {/* Forgot password link — login only */}
              {isLoginPage && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(true); setError(""); }}
                    className="text-[10px] font-bold text-gray-400 hover:text-yellow-600 tracking-widest uppercase transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 text-black font-black uppercase italic tracking-widest text-xs py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[52px]"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  isLoginPage ? "Sign In" : "Create Account"
                )}
              </button>
            </form>

            {/* Back to main options */}
            <button
              type="button"
              onClick={() => { setShowEmailForm(false); setError(""); setShowPassword(false); }}
              className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 text-xs font-bold py-2 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> All sign-in options
            </button>
          </div>

        /* ─── Default View (Google + Guest + Email trigger) ─── */
        ) : (
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

            {/* Subtle email/password trigger */}
            <button
              onClick={() => { setShowEmailForm(true); setError(""); }}
              className="w-full text-center text-[10px] text-gray-400 hover:text-gray-600 font-medium py-3 transition-colors tracking-wide"
            >
              No Google account? <span className="underline font-bold">Try another way</span>
            </button>
          </div>
        )}

        {/* Login/Signup toggle — always visible */}
        {!showForgotPassword && (
          <p className="mt-8 text-xs text-gray-400 font-bold uppercase tracking-widest">
            {isLoginPage ? (
              <>New to Xpress? <span onClick={() => { navigate('/signup'); setShowEmailForm(false); setError(""); }} className="text-yellow-600 cursor-pointer hover:underline">Register</span></>
            ) : (
              <>Have an account? <span onClick={() => { navigate('/login'); setShowEmailForm(false); setError(""); }} className="text-yellow-600 cursor-pointer hover:underline">Sign In</span></>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
