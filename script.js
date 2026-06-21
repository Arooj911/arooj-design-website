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

// Mobile menu
function openMobileMenu() {
  document.getElementById('mobileMenu').classList.add('open');
  document.getElementById('mobileOverlay').classList.add('active');
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('mobileOverlay').classList.remove('active');
}

// Policy toast for feature items
function showPolicyToast(msg) {
  const existing = document.querySelector('.policy-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'policy-toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
    background: #1a1a1a; color: #fff; padding: 14px 28px;
    font-family: 'Montserrat', sans-serif; font-size: 13px; letter-spacing: 0.5px;
    border-radius: 4px; z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    max-width: 90vw; text-align: center;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Product Modal
function openProductModal(imgSrc, name, price, badge) {
  document.getElementById('productModalImg').src = imgSrc;
  document.getElementById('productModalName').textContent = name;
  document.getElementById('productModalPrice').textContent = price;
  document.getElementById('productModalBadge').textContent = badge || '';
  document.getElementById('productModalBadge').style.display = badge ? 'inline-block' : 'none';
  document.getElementById('productModal').classList.add('active');
  document.getElementById('productModalOverlay').classList.add('active');

  const btn = document.getElementById('productModalBtn');
  btn.onclick = function() {
    const priceNum = parseInt(price.replace(/[^0-9]/g, ''));
    addToCart(name, priceNum, imgSrc);
    closeProductModal();
  };
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  document.getElementById('productModalOverlay').classList.remove('active');
}

// Search
function openSearch() {
  document.getElementById('searchOverlay').classList.add('open');
  document.getElementById('searchBackdrop').classList.add('active');
  document.getElementById('searchInput').focus();
  document.getElementById('searchResults').innerHTML = '';
}

function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('open');
  document.getElementById('searchBackdrop').classList.remove('active');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
}

let searchMatchedCards = [];

function searchProducts() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const resultsEl = document.getElementById('searchResults');
  if (!query) { resultsEl.innerHTML = ''; searchMatchedCards = []; return; }

  const cards = document.querySelectorAll('.product-card');
  searchMatchedCards = [];
  cards.forEach(card => {
    const name = card.querySelector('.product-name')?.textContent || '';
    if (name.toLowerCase().includes(query)) {
      const img = card.querySelector('.product-img img')?.src || '';
      searchMatchedCards.push({ name, img, card });
    }
  });

  if (searchMatchedCards.length === 0) {
    resultsEl.innerHTML = '<p class="search-empty">No products found.</p>';
  } else {
    resultsEl.innerHTML = searchMatchedCards.map((m, i) => `
      <div class="search-result-item" onclick="goToProduct(${i})">
        ${m.img ? `<img src="${m.img}" alt="${m.name}"/>` : ''}
        <span>${m.name}</span>
      </div>`).join('');
  }
}

function goToProduct(index) {
  const match = searchMatchedCards[index];
  if (!match) return;
  closeSearch();
  setTimeout(() => {
    match.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    match.card.style.outline = '2px solid #b8860b';
    match.card.style.transition = 'outline 0.3s';
    setTimeout(() => { match.card.style.outline = 'none'; }, 2000);
  }, 350);
}

// Profile dropdown
function toggleProfile() {
  const dd = document.getElementById('profileDropdown');
  dd.classList.toggle('open');
}

function closeProfile() {
  document.getElementById('profileDropdown').classList.remove('open');
}

document.addEventListener('click', function(e) {
  const dd = document.getElementById('profileDropdown');
  const btn = document.getElementById('profileBtn');
  if (dd && !dd.contains(e.target) && e.target !== btn) {
    dd.classList.remove('open');
  }
});

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

function checkoutWhatsApp() {
  if (cart.length === 0) return;
  let msg = 'Hello! I would like to place an order:%0A%0A';
  cart.forEach(item => {
    msg += `• ${item.name} x${item.qty} — Rs. ${(item.price * item.qty).toLocaleString()}%0A`;
  });
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  msg += `%0ATotal: Rs. ${total.toLocaleString()}`;
  window.open(`https://wa.me/923000000000?text=${msg}`, '_blank');
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
    const badge = card.querySelector('.badge')?.textContent || '';

    btn.addEventListener('click', () => addToCart(name, price, imgSrc));

    // Image click opens modal
    const imgWrap = card.querySelector('.product-img');
    if (imgWrap) {
      imgWrap.style.cursor = 'pointer';
      imgWrap.addEventListener('click', () => openProductModal(imgSrc, name, priceText, badge));
    }
  });

  // Cart icon in navbar opens cart
  document.getElementById('cartBtn')?.addEventListener('click', openCart);

  // Contact form - Netlify Forms
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'SENDING...';
      btn.disabled = true;

      const formData = new FormData(contactForm);
      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });
        showToast('✓ Message sent! We will get back to you soon.');
        contactForm.reset();
      } catch {
        showToast('Something went wrong. Please try again.');
      }
      btn.textContent = 'SEND MESSAGE';
      btn.disabled = false;
    });
  }

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
      background: #b8860b; color: #fff; padding: 16px 32px;
      font-family: 'Montserrat', sans-serif; font-size: 14px; letter-spacing: 1px;
      border-radius: 4px; z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }
});
