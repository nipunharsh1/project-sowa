const API_URL = "http://localhost:8080/api/products";

// --- AUTH GUARD ---
const session = JSON.parse(localStorage.getItem('fitstore_session'));
if (!session || !session.loggedIn) {
    window.location.href = 'login.html';
}

// Show username in navbar
document.getElementById('nav-username').textContent = `👤 ${session.username}`;

// --- CART ---
let cart = JSON.parse(localStorage.getItem('fitness_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    fetchProducts();
});

async function fetchProducts() {
    const container = document.getElementById('products-container');
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();

        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = '<p class="loading">No products found.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency', currency: 'USD'
            }).format(product.price);

            card.innerHTML = `
                <div class="card-img-wrap">
                    <img src="${product.imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='https://placehold.co/300x220?text=No+Image'">
                </div>
                <div class="product-info">
                    <div class="product-brand">${product.brand}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-desc">${product.description || ''}</p>
                    <div class="product-footer">
                        <div class="product-price">${formattedPrice}</div>
                        <div class="product-stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}">${product.stock > 0 ? `✅ In Stock (${product.stock})` : '❌ Out of Stock'}</div>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price})" ${product.stock === 0 ? 'disabled' : ''}>
                        ${product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p class="loading" style="color:#ff6b6b">Error loading products. Is the backend running?</p>';
    }
}

function addToCart(productId, productName, productPrice) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
    }
    saveCart();
    showToast(`Added "${productName}" to cart!`);
}

function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        saveCart();
    }
}

function saveCart() {
    localStorage.setItem('fitness_cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = count;
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    if (modal.style.display === 'block') renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        totalEl.innerText = '$0.00';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity} = <strong>$${itemTotal.toFixed(2)}</strong></div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
            </div>
        `;
        container.appendChild(cartItem);
    });

    totalEl.innerText = '$' + total.toFixed(2);
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) removeFromCart(productId);
    else saveCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

function logout() {
    localStorage.removeItem('fitstore_session');
    window.location.href = 'login.html';
}

// Toast notification
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}
