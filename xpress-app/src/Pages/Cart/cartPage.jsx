import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, MessageCircle, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { useSelector } from "react-redux";
import { useState } from "react";
import DeleteConfirmationModal from "../../Components/Modal/DeleteConfirmationModal";
import { requestParts } from "../../lib/orderService";
import { auth } from "../../Firebase/firebase";

export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isOnboarded, user } = useSelector((state) => state.user);
  const { cartItems, updateQuantity, removeItem, getTotalItems, getSubtotal } =
    useCart();
  const subtotal = getSubtotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [requestError, setRequestError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

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

  const handleRequestParts = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (isAuthenticated && !isOnboarded) {
      navigate('/onboarding');
      return;
    }

    setRequestStatus('loading');
    setRequestError("");

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error("Not authenticated");
      const token = await firebaseUser.getIdToken();

      const result = await requestParts({ cartItems, user, token });

      if (result.success) {
        setRequestStatus('success');
        setWhatsappUrl(result.waUrl);
        
        // Try to open WhatsApp automatically (might be blocked, which is why we show the button)
        try {
          window.open(result.waUrl, "_blank");
        } catch (e) {
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
    } catch (err) {
      setRequestStatus('error');
      setRequestError(err.message || "Failed to submit request.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
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
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-colors text-sm"
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
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-lg md:text-xl font-bold text-black mb-3">
                        GH₵{item.price.toFixed(2)}
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
                        GH₵{(item.price * item.quantity).toFixed(2)}
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
              <div className="bg-white rounded-2xl p-5 sticky top-24">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                  Order Summary
                </h2>

                {/* Summary Lines */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Subtotal</span>
                    <span>GH₵{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Tax (8%)</span>
                    <span>GH₵{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-base font-bold text-gray-800">
                      Total
                    </span>
                    <span className="text-xl md:text-2xl font-bold text-black">
                      GH₵{total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Excluding shipping and handling
                  </p>
                </div>

                {/* WhatsApp status feedback */}
                {requestStatus === 'success' && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left w-full">
                      <p className="text-sm font-bold text-green-800">Request Sent! 🎉</p>
                      <p className="text-xs text-green-700 mt-1 mb-4">
                        Your parts request has been submitted to our system. Please click the button below to send the details to our WhatsApp team.
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
                  disabled={requestStatus === 'loading' || requestStatus === 'success'}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors mb-2 text-sm"
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
                    📲 A WhatsApp message will be sent to our team with your order details.
                  </p>
                )}
                <button
                  onClick={() => navigate("/xplore")}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-black font-semibold py-2 rounded-lg transition-colors text-sm"
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
