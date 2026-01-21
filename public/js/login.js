document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const loginBtn = document.querySelector('.login-button');
  const btnText = document.querySelector('.button-text');
  const btnSpinner = document.querySelector('.button-spinner');
  const toast = document.getElementById('toast-message');

  // Toggle password visibility
  togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
  });

  // Show toast message
  const showToast = (message, type = 'error') => {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 5000);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showToast('Please fill all fields.', 'error');
      return;
    }

    // Show loading state
    btnText.style.display = 'none';
    btnSpinner.style.display = 'inline';
    loginBtn.disabled = true;

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Login failed. Please check your email and password.', 'error');
        return;
      }

      // Save auth data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      // Show success
      showToast(`Login successful! Redirecting as ${data.user.role}...`, 'success');

      // Redirect based on role (you can create these pages later)
      setTimeout(() => {
        switch (data.user.role) {
          case 'Super Admin':
            window.location.href = '/pages/superadmin/dashboard.html';
            break;
          case 'Payroll Admin':
            window.location.href = '/pages/payroll-admin/dashboard.html';
            break;
          case 'HR Admin':
            window.location.href = '/pages/hr-admin/dashboard.html';
            break;
          case 'Employee':
            window.location.href = '/pages/employee/dashboard.html';
            break;
          case 'Finance':
            window.location.href = '/pages/finance/dashboard.html';
            break;
          default:
            window.location.href = '/pages/login.html';
        }
      }, 1800);

    } catch (err) {
      console.error('Login error:', err);
      showToast('Network error. Is backend running on http://localhost:8000?', 'error');
    } finally {
      // Reset button state
      btnText.style.display = 'inline';
      btnSpinner.style.display = 'none';
      loginBtn.disabled = false;
    }
  });
});


  