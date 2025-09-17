// js/main.js

// Load cart from localStorage or empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = count;
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

// Add item to cart
document.querySelectorAll(".addToCart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const item = cart.find((i) => i.name === name);

    if (item) {
      item.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    saveCart();
    alert(`${name} added to cart!`);
  });
});

// Render cart items inside modal
function renderCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  const totalPriceEl = document.getElementById("totalPrice");

  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="text-gray-600 text-center">Your cart is empty.</p>';
    totalPriceEl.textContent = "₹0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className =
      "flex justify-between items-center border-b py-2 text-sm md:text-base";
    div.innerHTML = `
      <span>${item.name} (₹${item.price})</span>
      <div class="flex items-center gap-2">
        <button class="decrease px-2 bg-gray-200 rounded" data-index="${index}">-</button>
        <span>${item.qty}</span>
        <button class="increase px-2 bg-gray-200 rounded" data-index="${index}">+</button>
        <button class="remove text-red-500 ml-2" data-index="${index}">✕</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  totalPriceEl.textContent = `₹${total}`;
}

// Handle increase/decrease/remove
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("increase")) {
    const idx = e.target.dataset.index;
    cart[idx].qty++;
    saveCart();
  }
  if (e.target.classList.contains("decrease")) {
    const idx = e.target.dataset.index;
    if (cart[idx].qty > 1) {
      cart[idx].qty--;
    } else {
      cart.splice(idx, 1);
    }
    saveCart();
  }
  if (e.target.classList.contains("remove")) {
    const idx = e.target.dataset.index;
    cart.splice(idx, 1);
    saveCart();
  }
});

// Cart modal toggle
const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");

if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
    renderCartItems();
  });
}

if (closeCart) {
  closeCart.addEventListener("click", () => {
    cartModal.classList.add("hidden");
  });
}

// Clear Cart
document.getElementById("clearCart")?.addEventListener("click", () => {
  cart = [];
  saveCart();
});

// Checkout
document.getElementById("checkoutBtn")?.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Thank you for your order! 🥐");
  cart = [];
  saveCart();
});

// Initialize
updateCartCount();


// Load cart items on checkout page
function loadCheckout() {
  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");

  if (!checkoutItems) return;

  checkoutItems.innerHTML = "";

  if (cart.length === 0) {
    checkoutItems.innerHTML = '<p class="text-gray-600">Your cart is empty.</p>';
    checkoutTotal.textContent = "₹0";
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.className = "flex justify-between border-b py-2";
    div.innerHTML = `<span>${item.name} x ${item.qty}</span><span>₹${item.price * item.qty}</span>`;
    checkoutItems.appendChild(div);
  });

  checkoutTotal.textContent = `₹${total}`;
}

// Checkout form submission
document.getElementById("checkoutForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("🎉 Thank you! Your order has been placed successfully.");
  cart = [];
  saveCart();
  window.location.href = "index.html";
});

loadCheckout();
