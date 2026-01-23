document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) {
    console.error("Login form not found");
    return;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Login failed");
        return;
      }

      // SAVE TOKEN & USER (IMPORTANT)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ROLE BASED REDIRECT
      const role = data.user.role;

      if (role === "Super Admin") {
        window.location.href = "/pages/superadmin/dashboard.html";
      } else if (role === "HR Admin") {
        window.location.href = "/pages/hr-admin/dashboard.html";
      } else if (role === "Payroll Admin") {
        window.location.href = "/pages/payroll-admin/dashboard.html";
      } else if (role === "Finance") {
        window.location.href = "/pages/finance/dashboard.html";
      } else if (role === "Employee") {
        window.location.href = "/pages/employee/dashboard.html";
      } else {
        alert("Unknown role");
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Server error during login");
    }
  });
});
