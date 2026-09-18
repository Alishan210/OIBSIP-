document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const dashboardView = document.getElementById('dashboardView');
    const tabHeader = document.querySelector('.tab-header');
    
    const loginTabBtn = document.getElementById('loginTabBtn');
    const registerTabBtn = document.getElementById('registerTabBtn');
    const alertBox = document.getElementById('alertBox');
    const userDisplayName = document.getElementById('userDisplayName');
    const logoutBtn = document.getElementById('logoutBtn');

    // SHA-256 Hashing Implementation (Web Crypto API)
    async function hashPassword(password) {
        const msgUint8 = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Check active session on initial load
    checkSession();

    // Tab Switching
    loginTabBtn.addEventListener('click', () => switchTab('login'));
    registerTabBtn.addEventListener('click', () => switchTab('register'));

    function switchTab(tab) {
        clearAlert();
        if (tab === 'login') {
            loginTabBtn.classList.add('active');
            registerTabBtn.classList.remove('active');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        } else {
            registerTabBtn.classList.add('active');
            loginTabBtn.classList.remove('active');
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        }
    }

    // User Registration
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAlert();

        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim().toLowerCase();
        const password = document.getElementById('regPassword').value;

        // Password Validation: Minimum 8 characters, at least 1 number
        const passwordRegex = /^(?=.*[0-9]).{8,}$/;
        if (!passwordRegex.test(password)) {
            showAlert('Password must be at least 8 characters long and contain at least 1 number.', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('auth_users')) || [];

        // Duplicate username or email check
        const userExists = users.some(u => u.username.toLowerCase() === username.toLowerCase() || u.email === email);
        if (userExists) {
            showAlert('A user with this username or email already exists.', 'error');
            return;
        }

        // Store hashed password
        const hashedPassword = await hashPassword(password);
        users.push({ username, email, password: hashedPassword });
        localStorage.setItem('auth_users', JSON.stringify(users));

        showAlert('Registration successful! Please login.', 'success');
        registerForm.reset();
        setTimeout(() => switchTab('login'), 1200);
    });

    // User Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAlert();

        const identifier = document.getElementById('loginIdentifier').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;

        const users = JSON.parse(localStorage.getItem('auth_users')) || [];
        const hashedPassword = await hashPassword(password);

        // Verify credentials
        const matchedUser = users.find(u => 
            (u.username.toLowerCase() === identifier || u.email === identifier) && 
            u.password === hashedPassword
        );

        if (matchedUser) {
            // Save active session
            localStorage.setItem('auth_session', JSON.stringify({ username: matchedUser.username }));
            loginForm.reset();
            checkSession();
        } else {
            // Generic error message (does not reveal specific field)
            showAlert('Invalid credentials. Please try again.', 'error');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('auth_session');
        checkSession();
        showAlert('Logged out successfully.', 'success');
    });

    // Protected Route / Dashboard Handler
    function checkSession() {
        const activeSession = JSON.parse(localStorage.getItem('auth_session'));

        if (activeSession && activeSession.username) {
            userDisplayName.innerText = activeSession.username;
            dashboardView.classList.remove('hidden');
            loginForm.classList.add('hidden');
            registerForm.classList.add('hidden');
            tabHeader.classList.add('hidden');
        } else {
            dashboardView.classList.add('hidden');
            tabHeader.classList.remove('hidden');
            switchTab('login');
        }
    }

    function showAlert(msg, type) {
        alertBox.innerText = msg;
        alertBox.className = `alert ${type}`;
    }

    function clearAlert() {
        alertBox.innerText = '';
        alertBox.className = 'alert hidden';
    }
});