import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { useSelector } from "react-redux";

export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isOnboarded } = useSelector((state) => state.user);
  const { cartItems, updateQuantity, removeItem, getTotalItems, getSubtotal } =
    useCart();
  const subtotal = getSubtotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
    } else if (isAuthenticated && !isOnboarded) {
      navigate('/onboarding');
    } else {
      // Proceed to actual checkout logic
      alert("Proceeding to checkout...");
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
              onClick={() => navigate("/product")}
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
                        onClick={() => removeItem(item.id)}
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

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-lg transition-colors mb-2 text-sm"
                >
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => navigate("/product")}
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
      </div>
    </div>
  );
}
