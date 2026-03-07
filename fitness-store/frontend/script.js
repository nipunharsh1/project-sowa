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
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.name}')">Add to Cart</button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p class="loading" style="color:red">Error loading products. Is the backend running?</p>';
    }
}

function addToCart(productId, productName) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, name: productName, quantity: 1 });
    }
    
    saveCart();
    alert(`Added ${productName} to cart!`);
}

function clearCart() {
    if(confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        saveCart();
    }
}

function saveCart() {
    localStorage.setItem('fitness_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = count;
}
