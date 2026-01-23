document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  const toast = document.getElementById('toast-message');

  const showToast = (message, type = 'error') => {
    if (toast) {
      toast.textContent = message;
      toast.className = `toast ${type}`;
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 4000);
    }
  };

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const token = localStorage.getItem('authToken');
  
  if (!user || !token) {
    window.location.href = '/pages/login.html';
    return;
  }

  // Get current dashboard from URL
  const currentPath = window.location.pathname;
  
  // Role-based protection (checks URL + user role)
  const roleChecks = {
    '/superadmin/': 'Super Admin',
    '/payroll-admin/': 'Payroll Admin', 
    '/hr-admin/': 'HR Admin',
    '/employee/': 'Employee',
    '/finance/': 'Finance'
  };

  // Find which dashboard this is
  let requiredRole = null;
  for (const [path, role] of Object.entries(roleChecks)) {
    if (currentPath.includes(path)) {
      requiredRole = role;
      break;
    }
  }

  // If not a role dashboard, allow access (login page, etc.)
  if (!requiredRole) {
    initDashboard();
    return;
  }

  // Check if user has correct role for this dashboard
  if (user.role !== requiredRole) {
    showToast(`Access denied. ${requiredRole} required.`, 'error');
    setTimeout(() => {
      window.location.href = '/pages/login.html';
    }, 2000);
    return;
  }

  // User has correct role → initialize dashboard
  initDashboard();

  function initDashboard() {
    // Update user info everywhere
    document.querySelectorAll('.user-name').forEach(el => {
      el.textContent = user.name || requiredRole;
    });
    document.querySelectorAll('.user-role').forEach(el => {
      el.textContent = user.role;
    });

    // User initials in header
    const initialsEl = document.querySelector('.user-initials');
    if (initialsEl) {
      const initials = user.name 
        ? user.name.charAt(0).toUpperCase() 
        : requiredRole.charAt(0);
      initialsEl.textContent = initials;
    }

    // Logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Logout?')) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          window.location.href = '/pages/login.html';
        }
      });
    }
  }
});
