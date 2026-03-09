// Hardcoded credentials (frontend-only auth for educational purposes)
const USERS = {
    user: { password: 'user123', role: 'user' },
    admin: { password: 'admin123', role: 'admin' }
};

// If already logged in, redirect away from login page
const session = JSON.parse(localStorage.getItem('fitstore_session'));
if (session && session.loggedIn) {
    if (session.role === 'admin') {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'index.html';
    }
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');

    const account = USERS[username];
    if (!account || account.password !== password) {
        errorEl.textContent = 'Invalid username or password. Please try again.';
        errorEl.style.display = 'block';
        return;
    }

    // Save session
    localStorage.setItem('fitstore_session', JSON.stringify({
        loggedIn: true,
        username: username,
        role: account.role
    }));

    // Redirect based on role
    if (account.role === 'admin') {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'index.html';
    }
}
