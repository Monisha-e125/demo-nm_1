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

  // ===============================
  // AUTH CHECK (ONLY THIS IS NEEDED)
  // ===============================
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const token = localStorage.getItem('authToken');

  if (!user || !token) {
    window.location.href = '/login.html';
    return;
  }

  // ===============================
  // INITIALIZE DASHBOARD
  // ===============================
  initDashboard();

  function initDashboard() {
    // Show user name
    document.querySelectorAll('.user-name').forEach(el => {
      el.textContent = user.name || 'User';
    });

    // Show user role
    document.querySelectorAll('.user-role').forEach(el => {
      el.textContent = user.role;
    });

    // User initials
    const initialsEl = document.querySelector('.user-initials');
    if (initialsEl) {
      const initials = user.name
        ? user.name.charAt(0).toUpperCase()
        : user.role.charAt(0).toUpperCase();
      initialsEl.textContent = initials;
    }

    // ===============================
    // LOGOUT
    // ===============================
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Logout?')) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          window.location.href = '/login.html';
        }
      });
    }
  }
});
