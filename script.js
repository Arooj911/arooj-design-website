// Tab switching (from tab buttons inside page)
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
  event.target.classList.add('active');
}

// Tab switching (from navbar links)
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const content = document.getElementById(tabName);
  if (content) content.classList.add('active');
  document.querySelectorAll('.tab').forEach(t => {
    if (t.getAttribute('onclick') && t.getAttribute('onclick').includes(tabName)) {
      t.classList.add('active');
    }
  });
}

// Cart
let cart = [];

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('active');
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('active');
}

function addToCart(name, price, imgSrc) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, imgSrc, qty: 1 });
  }
  renderCart();
  openCart();
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  renderCart();
}

function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(name);
    else renderCart();
  }
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  let total = 0;

  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    const imgHtml = item.imgSrc
      ? `<img src="${item.imgSrc}" class="cart-item-img" alt="${item.name}"/>`
      : `<div class="cart-item-img no-img">👗</div>`;

    return `
      <div class="cart-item">
        ${imgHtml}
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">Rs. ${item.price.toLocaleString()}</p>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty('${item.name}', -1)">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">×</button>
      </div>`;
  }).join('');

  document.getElementById('cartTotal').textContent = 'Rs. ' + total.toLocaleString();
}

// Attach add to cart to all buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.product-card').forEach(card => {
    const btn = card.querySelector('.add-btn');
    const name = card.querySelector('.product-name')?.textContent || 'Product';
    const priceText = card.querySelector('.product-price')?.textContent || 'Rs. 0';
    const price = parseInt(priceText.replace(/[^0-9]/g, ''));
    const img = card.querySelector('.product-img img');
    const imgSrc = img ? img.src : null;

    btn.addEventListener('click', () => addToCart(name, price, imgSrc));
  });

  // Cart icon in navbar opens cart
  document.querySelectorAll('.nav-icons span')[2]?.addEventListener('click', openCart);
});
