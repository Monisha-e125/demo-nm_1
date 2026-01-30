document.addEventListener('DOMContentLoaded', function() {
  
  // 🔍 Get elements safely
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  // ❌ Stop if elements missing
  if (!loginForm || !emailInput || !passwordInput) {
    console.error('❌ Login elements missing! Check HTML IDs');
    return;
  }
  
  console.log('✅ Login form ready!');
  
  // 🚀 Check if already logged in
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (token && user) {
    const userData = JSON.parse(user);
    redirectToDashboard(userData.role);
    return;
  }
  
  // 🎯 LOGIN FORM SUBMIT
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Loading state
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = '🔄 Logging in...';
      submitBtn.disabled = true;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    try {
      console.log('🔐 Login attempt:', email);
      
      // POST to your Express server
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          email: email, 
          password: password 
        })
      });
      
      const data = await response.json();
      console.log('📡 Response:', data);
      
      // ✅ SUCCESS - Save & redirect
      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('✅ Redirecting to:', data.user.role, 'dashboard');
        redirectToDashboard(data.user.role);
        
      } else {
        // ❌ Login failed
        alert(data.error || 'Invalid credentials!');
        console.error('❌ Login failed:', data.error);
      }
      
    } catch (error) {
      console.error('❌ Network error:', error);
      alert('Server offline? Check http://localhost:8000');
    } finally {
      // Reset button
      if (submitBtn) {
        submitBtn.textContent = 'Login';
        submitBtn.disabled = false;
      }
      passwordInput.value = '';
    }
  });
  
  // 🎯 5 DASHBOARD ROLE REDIRECTS
  function redirectToDashboard(role) {
    console.log('🎯 Going to dashboard for role:', role);
    
    const dashboardMap = {
      'super_admin': '/pages/superadmin/dashboard.html',
      'payroll_admin': '/pages/payroll-admin/dashboard.html',
      'hr_manager': '/pages/hr-manager/dashboard.html',
      'finance': '/pages/finance/dashboard.html',
      'employee': '/pages/employee/dashboard.html'
    };
    
    // ✅ CORRECT PATHS (no /public prefix)
    const path = dashboardMap[role] || '/pages/login.html';
    window.location.href = path;
  }
  
  // 💡 Demo credentials (console)
  console.log('%c👥 DEMO ACCOUNTS:', 'color: #667eea; font-size: 16px; font-weight: bold;');
  console.log('Super Admin: admin@company.com / admin@123#');
  console.log('Payroll Admin: payroll@company.com / payroll@123#');
  console.log('HR Admin: hr@company.com / hr@123#');
  console.log('Finance: finance@company.com / finance@123#');
  console.log('Employee: employee@company.com / employee@123#');
});
