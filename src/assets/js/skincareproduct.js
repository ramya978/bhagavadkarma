// ── PRODUCT DATA ──────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: 'Herbal Face Cream',    category: 'Skincare',  badge: 'New',      badgeClass: '',        price: 799,  oldPrice: 999,  desc: 'Natural herbal cream for glowing, hydrated & healthy skin. Enriched with turmeric and neem.',      image: 'images/Product/shopping1.webp' },
  { id: 2, name: 'Ayurvedic Healing Oil',category: 'Healing',   badge: 'Sale',     badgeClass: 'sale',    price: 599,  oldPrice: 799,  desc: 'Cold-pressed Ayurvedic oil blend for stress relief, body wellness and deep nourishment.',            image: 'images/Product/shopping2.webp' },
  { id: 3, name: 'Meditation Kit',       category: 'Wellness',  badge: 'Popular',  badgeClass: 'popular', price: 1299, oldPrice: 1599, desc: 'Complete spiritual meditation essentials — incense, mala beads, and a guidance booklet.',           image: 'images/Product/shopping3.webp' },
  { id: 4, name: 'Aroma Candle',         category: 'Sacred',    badge: 'Trending', badgeClass: 'trending',price: 499,  oldPrice: 699,  desc: 'Handcrafted spiritual aroma candle made with pure essential oils for deep calm and peace.',          image: 'images/Product/shopping4.webp' },
  { id: 5, name: 'Rose Face Serum',      category: 'Skincare',  badge: 'New',      badgeClass: '',        price: 899,  oldPrice: 1199, desc: 'Lightweight rose water serum with Vitamin C for brightening and anti-aging skin support.',           image: 'images/Product/shopping5.webp' },
  { id: 6, name: 'Kumkumadi Oil',        category: 'Healing',   badge: 'Sale',     badgeClass: 'sale',    price: 649,  oldPrice: 850,  desc: 'Traditional Kumkumadi tailam for face radiance, pigmentation and skin brightening.',                 image: 'images/Product/shopping6.webp' },
  { id: 7, name: 'Chakra Balancing Kit', category: 'Wellness',  badge: 'Popular',  badgeClass: 'popular', price: 1499, oldPrice: 1899, desc: 'Seven gemstone set with chakra guide for energy healing, balance and spiritual alignment.',          image: 'images/Product/shopping7.webp' },
  { id: 8, name: 'Camphor Dhoop Set',    category: 'Sacred',    badge: 'Trending', badgeClass: 'trending',price: 349,  oldPrice: 499,  desc: 'Pure camphor and sandalwood dhoop sticks for sacred rituals, puja, and home cleansing.',            image: 'images/Product/shopping8.webp' },
];

// ── RENDER CARDS ──────────────────────────────────────────────
function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(p => `
    <div class="col-lg-3 col-md-6">
      <div class="store-product-card">
        <div class="store-product-image">
          <a href="product-details.html" onclick="saveProduct(${p.id}); return true;">
            <img src="${p.image}" alt="${p.name}">
          </a>
          <span class="product-badge ${p.badgeClass}">${p.badge}</span>
          <div class="quick-add-overlay" onclick="saveProduct(${p.id})" style="cursor:pointer;">
            <i class="fa-solid fa-eye"></i> View Details
          </div>
        </div>
        <div class="store-product-content">
          <span class="product-category">${p.category}</span>
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="store-product-bottom">
            <div>
              <span class="product-new-price">₹${p.price}</span>
              <span class="product-old-price">₹${p.oldPrice}</span>
            </div>
            <button class="add-cart-btn" onclick="addToCart(${p.id})" title="Add to cart">
              <i class="fa-solid fa-cart-shopping"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ── SAVE & NAVIGATE TO PRODUCT DETAILS ────────────────────────
function saveProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (p) {
    localStorage.setItem('selectedProduct', JSON.stringify(p));
    window.location.href = 'product-details.html';
  }
}

// ── CART HELPERS ──────────────────────────────────────────────
function getCart()      { return JSON.parse(localStorage.getItem('bkCart') || '[]'); }
function saveCart(cart) { localStorage.setItem('bkCart', JSON.stringify(cart)); }

// ── ADD TO CART ───────────────────────────────────────────────
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const cart = getCart();
  const idx  = cart.findIndex(x => x.id === id);

  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 });
  }

  saveCart(cart);
  renderCartDrawer();
  showToast(p.name);
}

// ── REMOVE FROM CART ──────────────────────────────────────────
function removeFromCart(id) {
  saveCart(getCart().filter(x => x.id !== id));
  renderCartDrawer();
}

// ── RENDER CART DRAWER ────────────────────────────────────────
function renderCartDrawer() {
  const cart     = getCart();
  const totalQty = cart.reduce((s, x) => s + x.qty, 0);
  const totalAmt = cart.reduce((s, x) => s + x.price * x.qty, 0);

  // Safe element update
  const countEl    = document.getElementById('cart-count');
  const drawerCount= document.getElementById('drawer-count');
  const subtotalEl = document.getElementById('drawer-subtotal');
  const totalEl    = document.getElementById('drawer-total');
  const itemsEl    = document.getElementById('drawer-items');

  if (countEl)    countEl.textContent    = totalQty;
  if (drawerCount)drawerCount.textContent= totalQty;
  if (subtotalEl) subtotalEl.textContent = '₹' + totalAmt.toLocaleString('en-IN');
  if (totalEl)    totalEl.textContent    = '₹' + totalAmt.toLocaleString('en-IN');

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty-msg">Your cart is empty.</p>';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-line">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-line-info">
        <h5>${item.name}</h5>
        <p>Qty: ${item.qty}</p>
        <button class="cart-line-remove" onclick="removeFromCart(${item.id})">
          <i class="fa-solid fa-xmark"></i> Remove
        </button>
      </div>
      <span class="cart-line-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
    </div>
  `).join('');
}

// ── CART DRAWER OPEN / CLOSE ──────────────────────────────────
function openCartDrawer() {
  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer)  drawer.classList.add('open');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer)  drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ── CHECKOUT ──────────────────────────────────────────────────
function goToCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }
  localStorage.setItem('checkoutMode', 'cart');
  window.location.href = 'checkout.html'; // ✅ Fixed: correct page
}

// ── TOAST ─────────────────────────────────────────────────────
function showToast(name) {
  const t = document.getElementById('cartToast');
  if (!t) return;
  t.innerHTML = `<i class="fa-solid fa-check"></i> "${name}" added!`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}



// ── INIT ──────────────────────────────────────────────────────
renderProducts();
renderCartDrawer();