// Auth Page JavaScript - Registration & Login System

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    // Form toggle
    const toggleLinks = document.querySelectorAll('.toggle-form');
    toggleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.dataset.target;
            toggleForms(targetId);
        });
    });

    // Password toggle visibility
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            togglePasswordVisibility(targetId, btn);
        });
    });

    // Password generator
    const generateBtn = document.querySelector('.generate-password');
    if (generateBtn) {
        generateBtn.addEventListener('click', openPasswordGenerator);
    }

    // Modal controls
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closePasswordGenerator);
    }

    // Generate password button in modal
    const generateModalBtn = document.getElementById('generateBtn');
    if (generateModalBtn) {
        generateModalBtn.addEventListener('click', generatePassword);
    }

    // Use password button
    const usePasswordBtn = document.getElementById('usePasswordBtn');
    if (usePasswordBtn) {
        usePasswordBtn.addEventListener('click', useGeneratedPassword);
    }

    // Copy password button
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyPassword);
    }

    // Password length slider
    const passwordLength = document.getElementById('passwordLength');
    if (passwordLength) {
        passwordLength.addEventListener('input', (e) => {
            document.getElementById('lengthValue').textContent = e.target.value;
        });
    }

    // Password strength checker
    const signupPassword = document.getElementById('signupPassword');
    if (signupPassword) {
        signupPassword.addEventListener('input', checkPasswordStrength);
    }

    // Form submissions
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const signupForm = document.getElementById('signupFormElement');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Initial password generation
    generatePassword();
}

// Toggle between login and signup forms
function toggleForms(targetId) {
    const forms = document.querySelectorAll('.form-container');
    forms.forEach(form => {
        if (form.id === targetId) {
            form.classList.remove('hidden');
            form.style.animation = 'slideIn 0.6s ease';
        } else {
            form.classList.add('hidden');
        }
    });
}

// Toggle password visibility
function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Password Generator Functions
function openPasswordGenerator() {
    const modal = document.getElementById('passwordModal');
    modal.classList.add('active');
    generatePassword();
}

function closePasswordGenerator() {
    const modal = document.getElementById('passwordModal');
    modal.classList.remove('active');
}

function generatePassword() {
    const length = parseInt(document.getElementById('passwordLength').value);
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;

    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
        showNotification('Please select at least one character type', 'error');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    document.getElementById('generatedPassword').value = password;
}

function useGeneratedPassword() {
    const generatedPassword = document.getElementById('generatedPassword').value;
    const signupPassword = document.getElementById('signupPassword');
    
    if (signupPassword && generatedPassword) {
        signupPassword.value = generatedPassword;
        checkPasswordStrength({ target: signupPassword });
        closePasswordGenerator();
        showNotification('Password applied successfully!', 'success');
    }
}

function copyPassword() {
    const passwordInput = document.getElementById('generatedPassword');
    passwordInput.select();
    document.execCommand('copy');
    showNotification('Password copied to clipboard!', 'success');
}

// Password Strength Checker
function checkPasswordStrength(e) {
    const password = e.target.value;
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    let strength = 0;
    let text = '';
    let color = '';

    if (password.length === 0) {
        strengthBar.style.width = '0%';
        strengthText.textContent = 'Password Strength';
        return;
    }

    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;

    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 20;

    // Lowercase check
    if (/[a-z]/.test(password)) strength += 20;

    // Number check
    if (/[0-9]/.test(password)) strength += 15;

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;

    // Determine strength level
    if (strength <= 30) {
        text = 'Weak';
        color = '#e74c3c';
    } else if (strength <= 60) {
        text = 'Medium';
        color = '#f39c12';
    } else if (strength <= 85) {
        text = 'Strong';
        color = '#3498db';
    } else {
        text = 'Very Strong';
        color = '#2ecc71';
    }

    strengthBar.style.width = strength + '%';
    strengthBar.style.background = color;
    strengthText.textContent = text;
    strengthText.style.color = color;
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('eliUsers')) || [];

    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
        showNotification('No account found with this email', 'error');
        return;
    }

    if (user.password !== password) {
        showNotification('Incorrect password', 'error');
        return;
    }

    // Save session
    const sessionData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        loggedIn: true,
        loginTime: new Date().toISOString()
    };

    if (rememberMe) {
        localStorage.setItem('eliSession', JSON.stringify(sessionData));
    } else {
        sessionStorage.setItem('eliSession', JSON.stringify(sessionData));
    }

    showNotification('Login successful! Redirecting...', 'success');

    // Redirect to home page after 1.5 seconds
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
}

// Handle Signup
function handleSignup(e) {
    e.preventDefault();

    const firstName = document.getElementById('signupFirstName').value.trim();
    const lastName = document.getElementById('signupLastName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validation
    if (!firstName || !lastName) {
        showNotification('Please enter your full name', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (!agreeTerms) {
        showNotification('Please agree to terms and conditions', 'error');
        return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('eliUsers')) || [];
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        showNotification('An account with this email already exists', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('eliUsers', JSON.stringify(users));

    showNotification('Account created successfully! Redirecting to login...', 'success');

    // Switch to login form after 1.5 seconds
    setTimeout(() => {
        toggleForms('loginForm');
        document.getElementById('loginEmail').value = email;
        document.getElementById('signupFormElement').reset();
    }, 1500);
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    const messageEl = notification.querySelector('.notification-message');

    messageEl.textContent = message;
    notification.className = 'notification show ' + type;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Check if user is already logged in
function checkExistingSession() {
    const session = localStorage.getItem('eliSession') || sessionStorage.getItem('eliSession');
    
    if (session) {
        const userData = JSON.parse(session);
        if (userData.loggedIn) {
            // User is already logged in, could redirect to dashboard
            console.log('User already logged in:', userData);
        }
    }
}

// Call on page load
checkExistingSession();
