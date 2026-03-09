const API_URL = 'http://localhost:8080/api/products';

// Auth guard — only admin can access this page
const session = JSON.parse(localStorage.getItem('fitstore_session'));
if (!session || !session.loggedIn || session.role !== 'admin') {
    window.location.href = 'login.html';
}

// Show admin name in navbar
document.getElementById('admin-name').textContent = `👤 ${session.username}`;

// Load products on page load
loadProducts();

async function loadProducts() {
    const tbody = document.getElementById('products-tbody');
    const countBadge = document.getElementById('product-count');
    try {
        const res = await fetch(API_URL);
        const products = await res.json();
        countBadge.textContent = `${products.length} products`;

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="table-loading">No products found.</td></tr>';
            return;
        }

        tbody.innerHTML = products.map(p => `
            <tr id="row-${p.id}">
                <td class="id-cell">#${p.id}</td>
                <td><img src="${p.imageUrl || 'images/placeholder.webp'}" alt="${p.name}" class="table-img" onerror="this.src='https://placehold.co/60x60?text=N/A'"></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.brand}</td>
                <td class="price-cell">$${p.price.toFixed(2)}</td>
                <td>${p.stock}</td>
                <td class="action-cell">
                    <button class="edit-btn" onclick="loadEditForm(${p.id}, '${escapeStr(p.name)}', '${escapeStr(p.brand)}', ${p.price}, ${p.stock}, '${escapeStr(p.imageUrl)}', '${escapeStr(p.description)}')">✏️ Edit</button>
                    <button class="delete-btn" onclick="deleteProduct(${p.id})">🗑️ Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7" class="table-loading" style="color:red">Failed to load products. Is the backend running?</td></tr>';
        countBadge.textContent = 'Error';
    }
}

function escapeStr(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

async function handleProductSubmit(event) {
    event.preventDefault();
    const msgEl = document.getElementById('form-message');
    const editId = document.getElementById('edit-product-id').value;
    const isEdit = !!editId;

    const payload = {
        name: document.getElementById('prod-name').value,
        brand: document.getElementById('prod-brand').value,
        price: parseFloat(document.getElementById('prod-price').value),
        stock: parseInt(document.getElementById('prod-stock').value),
        imageUrl: document.getElementById('prod-image').value,
        description: document.getElementById('prod-desc').value
    };

    try {
        const url = isEdit ? `${API_URL}/${editId}` : API_URL;
        const method = isEdit ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Server error');

        showMessage(isEdit ? '✅ Product updated successfully!' : '✅ Product added successfully!', 'success');
        resetForm();
        loadProducts();
    } catch (err) {
        showMessage('❌ Failed to save product. Please try again.', 'error');
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        showMessage('✅ Product deleted successfully!', 'success');
        loadProducts();
    } catch (err) {
        showMessage('❌ Failed to delete product.', 'error');
    }
}

function loadEditForm(id, name, brand, price, stock, imageUrl, description) {
    document.getElementById('edit-product-id').value = id;
    document.getElementById('prod-name').value = name;
    document.getElementById('prod-brand').value = brand;
    document.getElementById('prod-price').value = price;
    document.getElementById('prod-stock').value = stock;
    document.getElementById('prod-image').value = imageUrl;
    document.getElementById('prod-desc').value = description;

    document.getElementById('form-title').textContent = `✏️ Editing Product #${id}`;
    document.getElementById('submit-btn').textContent = 'Save Changes';
    document.getElementById('cancel-btn').style.display = 'inline-block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('product-form').reset();
    document.getElementById('edit-product-id').value = '';
    document.getElementById('form-title').textContent = '➕ Add New Product';
    document.getElementById('submit-btn').textContent = 'Add Product';
    document.getElementById('cancel-btn').style.display = 'none';
    document.getElementById('form-message').style.display = 'none';
}

function showMessage(msg, type) {
    const el = document.getElementById('form-message');
    el.textContent = msg;
    el.className = `form-message ${type}`;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function logout() {
    localStorage.removeItem('fitstore_session');
    window.location.href = 'login.html';
}
