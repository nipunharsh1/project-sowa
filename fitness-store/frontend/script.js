const API_URL = "http://localhost:8080/api/products";

// Load cart from localStorage or initialize empty
let cart = JSON.parse(localStorage.getItem('fitness_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    fetchProducts();
});

async function fetchProducts() {
    const container = document.getElementById('products-container');
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();

        container.innerHTML = ''; // Clear loading message

        if (products.length === 0) {
            container.innerHTML = '<p class="loading">No products found. Please run the SQL insert script.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            // Format price
            const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(product.price);

            card.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-brand">${product.brand}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">${formattedPrice}</div>
                    <div class="product-stock">${product.stock > 0 ? 'In Stock (' + product.stock + ')' : 'Out of Stock'}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price})">Add to Cart</button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p class="loading" style="color:red">Error loading products. Is the backend running?</p>';
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
    alert(`Added ${productName} to cart!`);
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
    if (modal.style.display === "block") {
        modal.style.display = "none";
    } else {
        modal.style.display = "block";
        renderCart();
    }
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
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
                <div>$${item.price.toFixed(2)} x ${item.quantity} = <strong>$${itemTotal.toFixed(2)}</strong></div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
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

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}
