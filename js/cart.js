// cart.js
const CART_KEY = 'museumCartV1';

// Constants
const TAX_RATE = 0.102;
const MEMBER_DISCOUNT_RATE = 0.15;
const SHIPPING_RATE = 25.00;

const VOLUME_DISCOUNT_TIERS = [
  { min: 0, max: 49.99, rate: 0.00 },
  { min: 50, max: 99.99, rate: 0.05 },
  { min: 100, max: 199.99, rate: 0.10 },
  { min: 200, max: Infinity, rate: 0.15 }
];

// --- Helpers for cart storage ---
function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  render();
}

function removeItem(id) {
  let cart = readCart().filter(item => item.id !== id);
  writeCart(cart);
  render();
}

// --- Currency formatter ---
function fmt(num) {
  return (num < 0)
    ? `($${Math.abs(num).toFixed(2)})`
    : `$${num.toFixed(2)}`;
}

// --- Render cart ---
function render() {
  const cart = readCart();
  const body = document.getElementById("cartBody");
  body.innerHTML = "";

  if (cart.length === 0) {
    body.innerHTML = `<tr><td colspan="6">Your cart is empty</td></tr>`;
    document.getElementById("subtotalCell").textContent = "$0.00";
    document.getElementById("volumeDiscCell").textContent = "($0.00)";
    document.getElementById("memberDiscCell").textContent = "($0.00)";
    document.getElementById("shippingCell").textContent = "$0.00";
    document.getElementById("taxableSubtotalCell").textContent = "$0.00";
    document.getElementById("taxAmountCell").textContent = "$0.00";
    document.getElementById("invoiceTotalCell").textContent = "$0.00";
    return;
  }

  // --- Calculate Subtotal ---
  let subtotal = 0;
  cart.forEach(item => {
    const lineTotal = item.unitPrice * item.qty;
    subtotal += lineTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${item.image}" alt="${item.name}" width="50"></td>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${fmt(item.unitPrice)}</td>
      <td>${fmt(lineTotal)}</td>
      <td><button onclick="removeItem('${item.id}')">Remove</button></td>
    `;
    body.appendChild(row);
  });

  // --- Volume Discount ---
  let volumeRate = VOLUME_DISCOUNT_TIERS.find(t => subtotal >= t.min && subtotal <= t.max).rate;
  let volumeDisc = subtotal * volumeRate;

  // --- Member Discount (example: apply manually if desired) ---
  let memberDisc = 0;
  if (false) { // set to true if simulating a member checkout
    memberDisc = subtotal * MEMBER_DISCOUNT_RATE;
    volumeDisc = 0; // only one type of discount applies
  }

  // --- Shipping ---
  let shipping = SHIPPING_RATE;

  // --- Taxable Subtotal ---
  let taxableSubtotal = subtotal - volumeDisc - memberDisc + shipping;

  // --- Tax ---
  let tax = taxableSubtotal * TAX_RATE;

  // --- Final Invoice Total ---
  let invoiceTotal = taxableSubtotal + tax;

  // --- Update DOM ---
  document.getElementById("subtotalCell").textContent = fmt(subtotal);
  document.getElementById("volumeDiscCell").textContent = fmt(-volumeDisc);
  document.getElementById("memberDiscCell").textContent = fmt(-memberDisc);
  document.getElementById("shippingCell").textContent = fmt(shipping);
  document.getElementById("taxableSubtotalCell").textContent = fmt(taxableSubtotal);
  document.getElementById("taxAmountCell").textContent = fmt(tax);
  document.getElementById("invoiceTotalCell").textContent = fmt(invoiceTotal);
}

// --- Event Listeners ---
document.getElementById("clearCartBtn").addEventListener("click", clearCart);

// --- Initial Render ---
render();
