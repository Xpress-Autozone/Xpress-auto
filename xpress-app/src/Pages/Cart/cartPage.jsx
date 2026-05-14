import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, MessageCircle, Loader2, CheckCircle2, AlertCircle, MapPin, Navigation, Edit2, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import DeleteConfirmationModal from "../../Components/Modal/DeleteConfirmationModal";
import { requestParts } from "../../lib/orderService";
import { auth } from "../../Firebase/firebase";
import { updateUserProfile, updateUser } from "../../Redux/userSlice";

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, isOnboarded, user } = useSelector((state) => state.user);
  const { cartItems, updateQuantity, removeItem, getTotalItems, getSubtotal } =
    useCart();
  const subtotal = getSubtotal();
  // Ghana Tax Structure (2026): 15% VAT + 2.5% NHIL + 2.5% GETFund = 20% Effective Rate
  const taxRate = 0.20;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [isAnonymizing, setIsAnonymizing] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [requestError, setRequestError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState(user?.address || "");
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (user?.address) {
      setAddress(user.address);
    }
  }, [user]);

  const handleRemoveClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
                'User-Agent': 'Xpress-AutoZone-App'
              }
            }
          );
          const data = await response.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          }
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        alert("Failed to get your location. Please check your browser permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSaveAddress = async () => {
    if (!address || address.length < 5) {
      alert("Please provide a valid address.");
      return;
    }

    if (!isAuthenticated) {
      // Guest user: update local state only
      dispatch(updateUser({ address }));
      setIsEditingAddress(false);
      
      // Prompt them to create an account
      if (window.confirm("Address set for this session! To save your address permanently and track your orders, would you like to create an account?")) {
        navigate('/login', { state: { from: location } });
      }
      return;
    }
    
    try {
      const result = await dispatch(updateUserProfile({ address }));
      if (updateUserProfile.fulfilled.match(result)) {
        setIsEditingAddress(false);
      } else {
        // Handle specific error case where user session might have expired
        if (result.payload === "No user logged in" || result.payload === "Firebase user not found") {
          if (window.confirm("Your session has expired. Would you like to sign in again to save your address?")) {
            navigate('/login', { state: { from: location } });
          }
        } else {
          alert("Failed to update address. Please try again later.");
        }
      }
    } catch {
      alert("An error occurred while saving address.");
    }
  };

  const handleGuestCheckout = async () => {
    try {
      setIsAnonymizing(true);
      const { signInAnonymously } = await import("firebase/auth");
      await signInAnonymously(auth);
      setShowConversionModal(false);
      // Small delay to ensure Redux state is updated by MainLayout's listener
      setTimeout(() => {
        navigate('/onboarding', { state: { from: '/cart' } });
      }, 800);
    } catch (error) {
      console.error("Guest login failed:", error);
      alert("Failed to continue as guest. Please try again.");
    } finally {
      setIsAnonymizing(false);
    }
  };

  const handleRequestParts = async () => {
    if (!isAuthenticated) {
      setShowConversionModal(true);
      return;
    }
    if (isAuthenticated && !isOnboarded) {
      navigate('/onboarding');
      return;
    }
    
    if (!address || address.length < 5) {
      setIsEditingAddress(true);
      alert("Please set a Delivery address before requesting parts.");
      return;
    }

    setRequestStatus('loading');
    setRequestError("");

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error("Not authenticated");
      const token = await firebaseUser.getIdToken();

      const result = await requestParts({ cartItems, user: { ...user, address }, token });

      if (result.success) {
        setRequestStatus('success');
        setWhatsappUrl(result.waUrl);
        
        // Try to open WhatsApp automatically (might be blocked, which is why we show the button)
        try {
          window.open(result.waUrl, "_blank");
        } catch {
          console.warn("WhatsApp pop-up blocked by browser");
        }

        // Clear cart after a short delay so user sees the success message
        setTimeout(() => {
          cartItems.forEach(item => removeItem(item.id));
        }, 8000);
      } else {
        setRequestStatus('error');
        setRequestError(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      setRequestStatus('error');
      setRequestError(err.message || "Failed to submit request.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 text-left">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-600 font-semibold mb-3 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Shopping Cart
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Start shopping to add items to your cart!
            </p>
            <button
              onClick={() => navigate("/xplore")}
              className="btn-golden mx-auto"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl overflow-hidden">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-4 flex gap-3 ${index !== cartItems.length - 1
                      ? "border-b border-gray-200"
                      : ""
                      } hover:bg-gray-50 transition-colors`}
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs">Image</span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 text-left">
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-lg md:text-xl font-bold text-black mb-3">
                        GH₵{Number(item.price || 0).toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-700" />
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>

                    {/* Total and Remove */}
                    <div className="text-right">
                      <p className="text-base md:text-lg font-bold text-gray-800 mb-3">
                        GH₵{Number((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveClick(item)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-5 sticky top-24 text-left">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                  Order Summary
                </h2>

                {/* Delivery Destination */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                      <MapPin size={12} /> Delivering To
                    </span>
                    {!isEditingAddress && (
                      <button 
                        onClick={() => setIsEditingAddress(true)}
                        className="text-yellow-600 hover:text-yellow-700 font-bold text-[10px] uppercase tracking-tighter flex items-center gap-1"
                      >
                        <Edit2 size={10} /> {address ? "Edit" : "Set"}
                      </button>
                    )}
                  </div>
                  
                  {isEditingAddress ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter delivery address..."
                          className="w-full border border-gray-200 rounded-lg p-2 pr-10 text-xs font-bold focus:ring-1 focus:ring-yellow-400 outline-none min-h-[60px]"
                        />
                        <button
                          onClick={handleGetCurrentLocation}
                          disabled={isLocating}
                          className="absolute right-2 top-2 p-1.5 bg-[#4285F4] hover:bg-[#357ae8] text-white rounded-md shadow-sm transition-all active:scale-95"
                          title="Use current location"
                        >
                          {isLocating ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} className="fill-white" />}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveAddress}
                          className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all"
                        >
                          Confirm Destination
                        </button>
                        <button
                          onClick={() => { setIsEditingAddress(false); setAddress(user?.address || ""); }}
                          className="px-3 py-2 border border-gray-200 text-gray-400 hover:text-gray-600 rounded-lg text-[10px] font-black uppercase transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className={`text-xs font-bold leading-relaxed ${address ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                      {address || "No Delivery address set yet."}
                    </p>
                  )}
                </div>

                {/* Summary Lines */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Subtotal</span>
                    <span>GH₵{Number(subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <div className="flex flex-col">
                      <span className="font-medium text-black">VAT & Statutory Levies</span>
                      <span className="text-[10px] text-gray-400">15% VAT + 5% NHIL/GETFund</span>
                    </div>
                    <span>GH₵{Number(tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Delivery</span>
                    <span className="font-bold text-yellow-600">Calculated on dispatch</span>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-base font-bold text-gray-800">
                      Total
                    </span>
                    <span className="text-xl md:text-2xl font-bold text-black">
                      GH₵{Number(total || 0).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Excluding delivery and handling
                  </p>
                </div>

                {/* WhatsApp status feedback */}
                {requestStatus === 'success' && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left w-full">
                      <p className="text-sm font-bold text-green-800">Request Sent! 🎉</p>
                      <p className="text-xs text-green-700 mt-1 mb-4">
                        Your parts request has been submitted to our team. Please click the button below to finalize via WhatsApp.
                      </p>
                      <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5c] text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md active:scale-95"
                      >
                        <MessageCircle size={16} fill="white" />
                        Open WhatsApp Now
                      </a>
                    </div>
                  </div>
                )}
                {requestStatus === 'error' && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-red-800">Request Failed</p>
                      <p className="text-xs text-red-700 mt-1">{requestError}</p>
                    </div>
                  </div>
                )}

                {/* Request Parts Button */}
                <button
                  onClick={handleRequestParts}
                  disabled={requestStatus === 'loading' || requestStatus === 'success' || isEditingAddress}
                  className="btn-golden w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed mb-2"
                >
                  {requestStatus === 'loading' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending Request...</>
                  ) : requestStatus === 'success' ? (
                    <><CheckCircle2 className="w-4 h-4" /> Request Sent!</>
                  ) : (
                    <><MessageCircle className="w-4 h-4" /> Request Parts now</>
                  )}
                </button>

                {requestStatus !== 'success' && (
                  <p className="text-[10px] text-center text-gray-400 font-medium mb-2">
                    📲 A WhatsApp message will be sent with your order and delivery details.
                  </p>
                )}
                <button
                  onClick={() => navigate("/xplore")}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-black font-black uppercase italic tracking-widest py-3 rounded-lg transition-colors text-[10px]"
                >
                  Continue Shopping
                </button>

                {/* Cart Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold text-black">
                      {cartItems.length}
                    </span>{" "}
                    {cartItems.length === 1 ? "item" : "items"} in cart
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conversion Modal */}
        {showConversionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 mb-2">
                  Almost there!
                </h2>
                <p className="text-gray-500 text-sm font-medium mb-8">
                  How would you like to proceed with your request?
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/login', { state: { from: '/cart' } })}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-all flex items-center justify-center gap-2 group"
                  >
                    Sign In / Create Account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <span className="relative bg-white px-4 text-[9px] font-black uppercase text-gray-300 italic tracking-widest">or</span>
                  </div>

                  <button
                    onClick={handleGuestCheckout}
                    disabled={isAnonymizing}
                    className="w-full bg-white border-2 border-gray-900 text-gray-900 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAnonymizing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Starting Guest Session...</>
                    ) : (
                      "Continue as Guest (Fast)"
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setShowConversionModal(false)}
                  className="mt-6 text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                >
                  Maybe later
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[8px] font-bold text-gray-400 uppercase tracking-widest justify-center">
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  Verified & Secure Checkout
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          product={itemToDelete}
        />
      </div>
    </div>
  );
}
