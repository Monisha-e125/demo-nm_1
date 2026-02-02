document.addEventListener("DOMContentLoaded", function () {

  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!loginForm || !emailInput || !passwordInput) {
    console.error("Login elements missing. Check HTML IDs");
    return;
  }

  console.log("Login page ready");

  /* -------------------- AUTO LOGIN (LOGIN PAGE ONLY) -------------------- */
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("currentUser");

  if (
    token &&
    user &&
    window.location.pathname.includes("login")
  ) {
    try {
      const userData = JSON.parse(user);
      redirectToDashboard(userData.role);
      return;
    } catch (e) {
      localStorage.clear();
    }
  }

  /* -------------------- LOGIN SUBMIT -------------------- */
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = "Logging in...";
      submitBtn.disabled = true;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success && data.user && data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        redirectToDashboard(data.user.role);
      } else {
        alert(data.error || "Invalid credentials");
      }

    } catch (error) {
      console.error("Network error:", error);
      alert("Server not reachable");
    } finally {
      if (submitBtn) {
        submitBtn.textContent = "Login";
        submitBtn.disabled = false;
      }
      passwordInput.value = "";
    }
  });

  /* -------------------- ROLE BASED REDIRECT -------------------- */
  function redirectToDashboard(role) {
    if (!role) {
      window.location.href = "/login.html";
      return;
    }

    const normalizedRole = role
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_");

    const dashboardMap = {
      super_admin: "/pages/superadmin/dashboard.html",
      payroll_admin: "/pages/payroll-admin/dashboard.html",
      hr_admin: "/pages/hr-manager/dashboard.html",
      hr_manager: "/pages/hr-manager/dashboard.html",
      finance: "/pages/finance/dashboard.html",
      employee: "/pages/employee/dashboard.html"
    };

    const path = dashboardMap[normalizedRole];

    if (!path) {
      localStorage.clear();
      window.location.href = "/login.html";
      return;
    }

    window.location.href = path;
  }

});
