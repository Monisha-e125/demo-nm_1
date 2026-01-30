document.addEventListener('DOMContentLoaded', async () => {
  const logoutBtn = document.getElementById('logoutBtn');
  const toast = document.getElementById('toast-message');

  // 1. Toast notifications
  const showToast = (message, type = 'error') => {
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 4000);
  };

  // 2. Logout function
  const logoutUser = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('refreshToken'); // If using refresh tokens
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
      window.location.href = '/pages/login.html';
    }, 1500);
  };

  // 3. Token expiry check
  const checkTokenExpiry = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      logoutUser();
      return false;
    }

    try {
      // Decode JWT payload (client-side expiry check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        console.log('Token expired → auto-logout');
        logoutUser();
        return false;
      }
      return true;
    } catch (e) {
      console.error('Invalid token:', e);
      logoutUser();
      return false;
    }
  };

  // 4. Role-based dashboard protection
  const protectDashboard = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('authToken');
    
    // No token/user → logout
    if (!user || !token || !checkTokenExpiry()) {
      return false;
    }

    // Get current dashboard from URL
    const currentPath = window.location.pathname;
    const roleChecks = {
      '/superadmin/': 'Super Admin',
      '/payroll-admin/': 'Payroll Admin',
      '/hr-admin/': 'HR Admin',
      '/employee/': 'Employee',
      '/finance/': 'Finance'
    };

    // Check if this is a role-protected dashboard
    for (const [path, requiredRole] of Object.entries(roleChecks)) {
      if (currentPath.includes(path)) {
        if (user.role !== requiredRole) {
          showToast(`Access denied. ${requiredRole} role required.`);
          setTimeout(logoutUser, 2000);
          return false;
        }
        return { user, requiredRole };
      }
    }

    // Non-protected pages (login, etc.) → allow
    return { user };
  };

  // 5. Initialize dashboard UI
  const initDashboard = (user) => {
    // Update user info in header/sidebar
    document.querySelectorAll('.user-name').forEach(el => {
      el.textContent = user.name || user.role;
    });
    document.querySelectorAll('.user-role').forEach(el => {
      el.textContent = user.role;
    });

    // Update user initials
    const initialsEl = document.querySelector('.user-initials');
    if (initialsEl) {
      const initials = user.name ? user.name.charAt(0).toUpperCase() : user.role.charAt(0);
      initialsEl.textContent = initials;
    }

    // Logout button
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
          logoutUser();
        }
      });
    }

    // Page loaded successfully
    console.log(`✅ ${user.role} dashboard loaded`);
  };

  // 6. MAIN EXECUTION
  const authResult = protectDashboard();
  if (!authResult) {
    return; // User unauthorized → already handled
  }

  initDashboard(authResult.user);

  // 7. Auto token expiry check (every 5 minutes)
  setInterval(checkTokenExpiry, 5 * 60 * 1000);

  // 8. API wrapper with auto-refresh (future-proof)
  window.apiCall = async (url, options = {}) => {
    let token = localStorage.getItem('authToken');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      // Token expired → logout (refresh token logic can be added later)
      logoutUser();
      throw new Error('Session expired');
    }

    return response;
  };
});
