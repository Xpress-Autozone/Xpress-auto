const CART_STORAGE_KEY = "cart";

export const cartService = {
  getCart: () => {
    try {
      const cart = localStorage.getItem(CART_STORAGE_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error("Failed to get cart:", error);
      return [];
    }
  },

  saveCart: (items) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  },

  addItem: (product) => {
    const cart = cartService.getCart();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    cartService.saveCart(cart);
    return cart;
  },

  removeItem: (productId) => {
    const cart = cartService.getCart();
    const filtered = cart.filter((item) => item.id !== productId);
    cartService.saveCart(filtered);
    return filtered;
  },

  updateQuantity: (productId, quantity) => {
    const cart = cartService.getCart();
    const item = cart.find((item) => item.id === productId);

    if (item) {
      if (quantity <= 0) {
        return cartService.removeItem(productId);
      }
      item.quantity = quantity;
      cartService.saveCart(cart);
    }

    return cart;
  },

  clearCart: () => {
    cartService.saveCart([]);
  },

  getTotalItems: () => {
    const cart = cartService.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal: () => {
    const cart = cartService.getCart();
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
};
