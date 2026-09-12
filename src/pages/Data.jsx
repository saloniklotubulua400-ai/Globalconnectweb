export const products = [
  {
    id: "classic-tee",
    name: "Classic T-Shirt",
    price: 29.99,
    image: "/images/classic-tee.jpg",
    category: "Clothing",
    description: "A comfortable everyday cotton T-shirt.",
  },
  {
    id: "premium-hoodie",
    name: "Premium Hoodie",
    price: 64.99,
    image: "/images/premium-hoodie.jpg",
    category: "Clothing",
    description: "A heavyweight hoodie with a soft brushed interior.",
  },
  {
    id: "everyday-sneakers",
    name: "Everyday Sneakers",
    price: 89.99,
    image: "/images/everyday-sneakers.jpg",
    category: "Footwear",
    description: "Lightweight sneakers designed for everyday comfort.",
  },
  {
    id: "canvas-backpack",
    name: "Canvas Backpack",
    price: 54.99,
    image: "/images/canvas-backpack.jpg",
    category: "Accessories",
    description: "A durable backpack with multiple storage compartments.",
  },
];

export const cartItems = [
  {
    id: "classic-tee",
    name: "Classic T-Shirt",
    price: 29.99,
    quantity: 2,
    image: "/images/classic-tee.jpg",
  },
  {
    id: "premium-hoodie",
    name: "Premium Hoodie",
    price: 64.99,
    quantity: 1,
    image: "/images/premium-hoodie.jpg",
  },
];

export const categories = [
  "All",
  "Clothing",
  "Footwear",
  "Accessories",
];

export const checkoutConfig = {
  currency: "USD",
  taxRate: 0.08,
  shippingCost: 9.99,
  freeShippingThreshold: 100,
};

export const paymentMethods = [
  {
    id: "card",
    name: "Credit / Debit Card",
    enabled: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    enabled: false,
  },
];

export const orderStatus = {
  pending: "pending",
  processing: "processing",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
};

export function getProductById(id) {
  return products.find((product) => product.id === id);
}

export function getCartSubtotal(items = []) {
  return items.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );
}

export function getShippingCost(
  subtotal,
  config = checkoutConfig
) {
  if (subtotal <= 0) return 0;

  return subtotal >= config.freeShippingThreshold
    ? 0
    : config.shippingCost;
}

export function getTax(
  subtotal,
  config = checkoutConfig
) {
  return subtotal * config.taxRate;
}

export function getOrderTotal(
  items = [],
  config = checkoutConfig
) {
  const subtotal = getCartSubtotal(items);
  const shipping = getShippingCost(subtotal, config);
  const tax = getTax(subtotal, config);

  return {
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax,
  };
}
