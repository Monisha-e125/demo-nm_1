const API = "http://localhost:8000/api/employee";

async function loadEmployees() {
  try {
    console.log("Loading employees...");

    const res = await fetch(API);
    const data = await res.json(); // backend returns an array

    const container = document.getElementById("employees-container");

    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="no-data">
          <i class="fas fa-users-slash"></i>
          <h3>No Employees Found</h3>
          <p>This organization has no employees yet<br>
          <small>Click "Add Employee" to create first employee</small></p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Joined</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(emp => `
            <tr>
              <td><strong>${emp.employeeId || "N/A"}</strong></td>
              <td>${emp.name || "N/A"}</td>
              <td>${emp.department || "N/A"}</td>
              <td>${emp.designation || "N/A"}</td>
              <td>${new Date(emp.joiningDate).toLocaleDateString("en-IN")}</td>
              <td><span class="status status-active">Active</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("employees-container").innerHTML = `
      <div style="text-align:center;padding:60px;color:#dc2626;">
        <i class="fas fa-exclamation-triangle" style="font-size:64px;margin-bottom:20px;"></i>
        <h3>Error Loading Data</h3>
        <p>Check console (F12) for details</p>
      </div>
    `;
  }
}

// Auto-load on page open
window.onload = loadEmployees;
