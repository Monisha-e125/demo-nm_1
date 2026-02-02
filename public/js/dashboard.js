document.addEventListener("DOMContentLoaded", () => {
  // -------------------- AUTH CHECK --------------------
  const token = localStorage.getItem("authToken");
  const userStr = localStorage.getItem("currentUser");

  if (!token || !userStr) {
    redirectToLogin();
    return;
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    clearSession();
    return;
  }

  const role = normalizeRole(user.role);
  console.log("Dashboard loaded for role:", role);

  // -------------------- ROLE-BASED INIT --------------------
  switch (role) {
    case "super_admin":
      initSuperAdmin();
      break;

    case "payroll_admin":
      initPayrollAdmin();
      break;

    case "hr_admin":
    case "hr_manager":
      initHRAdmin();
      break;

    case "employee":
      initEmployee();
      break;

    default:
      console.warn("Unknown role:", role);
      clearSession();
      return;
  }

  // -------------------- LOGOUT --------------------
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
    });
  }

  // ==================== FUNCTIONS ====================

  function initSuperAdmin() {
    console.log("Init Super Admin dashboard");

    // IMPORTANT:
    // Do NOT auto-call restricted APIs on page load
    // Call them only on user action (button click)

    // Example: bind click if needed
    const statutoryCard = document.querySelector(
      ".stat-card[onclick*='statutory']"
    );

    if (statutoryCard) {
      statutoryCard.addEventListener("click", () => {
        window.location.href = "statutory.html";
      });
    }
  }

  function initPayrollAdmin() {
    console.log("Init Payroll Admin dashboard");

    // Payroll Admin should NOT call statutory / org APIs
    // Keep dashboard UI-only for now
  }

  function initHRAdmin() {
    console.log("Init HR Admin dashboard");

    // HR-specific lightweight init
  }

  function initEmployee() {
    console.log("Init Employee dashboard");
  }

  function normalizeRole(role) {
    return role
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_");
  }

  function clearSession() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    window.location.href = "/login.html";
  }

  function redirectToLogin() {
    window.location.href = "/login.html";
  }
});
