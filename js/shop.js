// Key for localStorage
const CART_KEY = 'museumCartV1';

// Read cart from localStorage
function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

// Write cart to localStorage
function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add item to cart
function addToCart(btn) {
  const id = btn.dataset.id;
  const name = btn.dataset.name;
  const unitPrice = Number(btn.dataset.price);
  const image = btn.dataset.image;

  let cart = readCart();
  const idx = cart.findIndex(it => it.id === id);
  if (idx >= 0) {
    cart[idx].qty += 1;
  } else {
    cart.push({ id, name, unitPrice, qty: 1, image });
  }
  writeCart(cart);

  // Update item’s qty badge
  const card = btn.closest('.souvenir-item');
  if (card) {
    const badge = card.querySelector('.qty-badge');
    if (badge) {
      const item = cart.find(it => it.id === id);
      badge.textContent = item ? `Qty: ${item.qty}` : '';
    }
  }
}

// Modal image logic (kept from your original file)
document.querySelectorAll('.shop-img').forEach(img => {
  img.addEventListener('click', () => {
    const modal = document.getElementById('itemModal');
    if (!modal) return;
    document.getElementById('modalTitle').textContent = img.title;
    document.getElementById('modalImage').src = img.src;
    document.getElementById('modalImage').alt = img.alt;
    document.getElementById('modalDesc').textContent = img.dataset.description;
    document.getElementById('modalPrice').textContent = `Price: ${img.dataset.price}`;
    modal.style.display = 'block';
  });
  img.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      img.click();
    }
  });
});

// Modal close functions
function closeModal() {
  const modal = document.getElementById('itemModal');
  if (modal) modal.style.display = 'none';
}

window.addEventListener('click', e => {
  const modal = document.getElementById('itemModal');
  if (e.target === modal) closeModal();
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
