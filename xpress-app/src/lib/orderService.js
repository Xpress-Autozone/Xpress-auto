const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://xpress-backend-eeea.onrender.com";

const WHATSAPP_NUMBER = "233271665737"; // Admin WhatsApp number

/**
 * Creates an order in the backend and opens a WhatsApp message to the admin.
 * @param {Object} params
 * @param {Array} params.cartItems - Cart items array from CartContext
 * @param {Object} params.user - Current user from Redux state
 * @param {string} params.token - Firebase ID token for auth
 * @returns {{ success: boolean, order: Object | null, error: string | null }}
 */
export async function requestParts({ cartItems, user, token }) {
  try {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const orderPayload = {
      customerId: user.uid,
      customerEmail: user.email || "",
      customerName: user.name || user.displayName || "",
      customerPhone: user.phone || "",
      paymentMethod: "whatsapp_request",
      paymentStatus: "pending",
      taxAmount: parseFloat(tax.toFixed(2)),
      notes: "Order placed via WhatsApp request flow.",
      items: cartItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image || "",
        vendorId: item.vendorId || "",
      })),
    };

    const response = await fetch(`${API_BASE_URL}/createOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create order");
    }

    const order = data.data;

    // Build WhatsApp message
    const orderNumber = order.orderNumber || order.id;
    const itemLines = cartItems
      .map(
        (item) => {
          const brandStr = item.brand ? ` [${item.brand}]` : "";
          const partNoStr = item.partNumber ? ` (P/N: ${item.partNumber})` : "";
          return `  • *${item.name}*${brandStr}${partNoStr}\n    Qty: ${item.quantity} — GH₵${(item.price * item.quantity).toFixed(2)}`;
        }
      )
      .join("\n\n");

    const message =
      `🛒 *New Parts Request — Xpress AutoZone*\n\n` +
      `*Order Ref:* #${orderNumber}\n` +
      `*Customer:* ${user.name || user.displayName || user.email}\n` +
      (user.phone ? `*Phone:* ${user.phone}\n` : "") +
      `\n*Parts Requested:*\n${itemLines}\n\n` +
      `*Subtotal:* GH₵${subtotal.toFixed(2)}\n` +
      `*Tax (8%):* GH₵${tax.toFixed(2)}\n` +
      `*Total:* GH₵${total.toFixed(2)}\n\n` +
      `Please confirm availability and contact the customer to arrange delivery. Thank you! 🚗`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(waUrl, "_blank");

    return { success: true, order, error: null };
  } catch (error) {
    console.error("❌ requestParts failed:", error.message);
    return { success: false, order: null, error: error.message };
  }
}
