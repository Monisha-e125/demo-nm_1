document.addEventListener('DOMContentLoaded', () => {

  const loginBtn = document.getElementById('loginBtn');

  loginBtn.addEventListener('click', async () => {

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Login failed');
        return;
      }

      /* clear old session */
      localStorage.clear();

      /* save new session */
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      /* role based redirect */
      switch (data.user.role) {
        case 'Super Admin':
          window.location.replace('/pages/superadmin/dashboard.html');
          break;

        case 'Payroll Admin':
          window.location.replace('/pages/payroll-admin/dashboard.html');
          break;

        case 'HR Admin':
          window.location.replace('/pages/hr-admin/dashboard.html');
          break;

        case 'Finance':
          window.location.replace('/pages/finance/dashboard.html');
          break;

        case 'Employee':
          window.location.replace('/pages/employee/dashboard.html');
          break;

        default:
          alert('Unknown role');
          window.location.replace('/login.html');
      }

    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  });
});
