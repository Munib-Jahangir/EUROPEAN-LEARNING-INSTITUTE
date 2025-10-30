// Session Manager - Handle Login State Across All Pages

(function() {
    'use strict';

    // Check login status on page load
    document.addEventListener('DOMContentLoaded', function() {
        updateNavigationBasedOnSession();
    });

    function updateNavigationBasedOnSession() {
        // Check for active session
        const session = getActiveSession();
        
        // Find the register link in navigation
        const registerLinks = document.querySelectorAll('nav ul li a[href*="register.html"]');
        
        if (!registerLinks || registerLinks.length === 0) return;

        registerLinks.forEach(registerLink => {
            const listItem = registerLink.parentElement;
            
            if (session && session.loggedIn) {
                // User is logged in - replace register button with user menu
                createUserMenu(listItem, session);
            } else {
                // User is not logged in - ensure register button is shown
                ensureRegisterButton(listItem, registerLink);
            }
        });
    }

    function getActiveSession() {
        // Check both localStorage and sessionStorage
        const localSession = localStorage.getItem('eliSession');
        const sessionSession = sessionStorage.getItem('eliSession');
        
        const session = localSession || sessionSession;
        
        if (session) {
            try {
                return JSON.parse(session);
            } catch (e) {
                console.error('Error parsing session:', e);
                return null;
            }
        }
        
        return null;
    }

    function createUserMenu(listItem, session) {
        // Remove existing content
        listItem.innerHTML = '';
        
        // Create user dropdown
        const userDropdown = document.createElement('div');
        userDropdown.className = 'user-dropdown';
        
        const userName = `${session.firstName} ${session.lastName}`;
        
        userDropdown.innerHTML = `
            <a href="#" class="user-menu-trigger">
                <i class="fas fa-user-circle"></i>
                <span class="user-name">${userName}</span>
                <i class="fas fa-chevron-down dropdown-icon"></i>
            </a>
            <div class="dropdown-menu">
                <div class="dropdown-header">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="user-info">
                        <strong>${userName}</strong>
                        <span class="user-email">${session.email}</span>
                    </div>
                </div>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                    <i class="fas fa-user"></i> My Profile
                </a>
                <a href="#" class="dropdown-item">
                    <i class="fas fa-cog"></i> Settings
                </a>
                <a href="#" class="dropdown-item">
                    <i class="fas fa-book"></i> My Courses
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        `;
        
        listItem.appendChild(userDropdown);
        
        // Add event listeners
        const menuTrigger = userDropdown.querySelector('.user-menu-trigger');
        const dropdownMenu = userDropdown.querySelector('.dropdown-menu');
        const logoutBtn = userDropdown.querySelector('.logout-btn');
        
        // Toggle dropdown
        menuTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
        
        // Logout functionality
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }

    function ensureRegisterButton(listItem, registerLink) {
        // Make sure the register button has proper class
        if (!registerLink.classList.contains('register-link')) {
            registerLink.classList.add('register-link');
        }
    }

    function handleLogout() {
        // Show confirmation
        if (confirm('Are you sure you want to logout?')) {
            // Clear session data
            localStorage.removeItem('eliSession');
            sessionStorage.removeItem('eliSession');
            
            // Show notification (if available)
            if (typeof showNotification === 'function') {
                showNotification('Logged out successfully!', 'success');
            }
            
            // Reload page to update navigation
            setTimeout(function() {
                window.location.reload();
            }, 500);
        }
    }

    // Export for use in other scripts
    window.SessionManager = {
        getActiveSession: getActiveSession,
        updateNavigation: updateNavigationBasedOnSession,
        logout: handleLogout
    };
})();
