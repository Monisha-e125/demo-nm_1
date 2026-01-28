document.addEventListener('DOMContentLoaded', () => {

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    window.location.replace('/login.html');
    return;
  }

  /* OPTIONAL: role guard per folder */
  const path = window.location.pathname;

  if (path.includes('/hr-admin') && user.role !== 'HR Admin') {
    unauthorized();
  }
  if (path.includes('/payroll-admin') && user.role !== 'Payroll Admin') {
    unauthorized();
  }
  if (path.includes('/employee') && user.role !== 'Employee') {
    unauthorized();
  }
  if (path.includes('/finance') && user.role !== 'Finance') {
    unauthorized();
  }
  if (path.includes('/superadmin') && user.role !== 'Super Admin') {
    unauthorized();
  }

  function unauthorized() {
    alert('Unauthorized access');
    localStorage.clear();
    window.location.replace('/login.html');
  }

  /* user info */
  document.querySelectorAll('.user-name').forEach(el => {
    el.textContent = user.name;
  });

  document.querySelectorAll('.user-role').forEach(el => {
    el.textContent = user.role;
  });

  const initialsEl = document.querySelector('.user-initials');
  if (initialsEl && user.name) {
    initialsEl.textContent = user.name.charAt(0).toUpperCase();
  }

  /* logout */
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.replace('/login.html');
    });
  }
});
