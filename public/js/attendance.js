const API = "http://localhost:8000/api/attendance";

/* Show leaveType only when status = L */
document.getElementById("status").addEventListener("change", function () {
  const leaveType = document.getElementById("leaveType");
  leaveType.style.display = this.value === "L" ? "block" : "none";
});

/* ---------- MARK ATTENDANCE ---------- */
async function markAttendance() {
  const body = {
    employeeId: document.getElementById("empId").value,
    date: document.getElementById("date").value,
    status: document.getElementById("status").value,
    leaveType: document.getElementById("leaveType").value,
    overtimeHours: Number(document.getElementById("overtime").value || 0)
  };

  const res = await fetch(`${API}/mark`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  document.getElementById("markMsg").innerText = data.message || data.error;
}

/* ---------- VIEW ATTENDANCE ---------- */
async function getAttendance() {
  const empId = document.getElementById("viewEmpId").value;
  const month = document.getElementById("viewMonth").value;
  const year = document.getElementById("viewYear").value;

  const res = await fetch(`${API}/${empId}/${month}/${year}`);
  const records = await res.json();

  const table = document.getElementById("attendanceTable");
  table.innerHTML = "";

  records.forEach(r => {
    table.innerHTML += `
      <tr>
        <td>${new Date(r.date).toDateString()}</td>
        <td>${r.status}</td>
        <td>${r.leaveType || "-"}</td>
        <td>${r.overtimeHours}</td>
        <td>${r.isPayrollLocked}</td>
      </tr>
    `;
  });
}

/* ---------- CALCULATE SALARY ---------- */
async function calculateSalary() {
  const body = {
    employeeId: document.getElementById("calcEmpId").value,
    month: Number(document.getElementById("calcMonth").value),
    year: Number(document.getElementById("calcYear").value),
    overtimeRate: Number(document.getElementById("otRate").value || 0)
  };

  const res = await fetch(`${API}/calculate-salary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  document.getElementById("salaryResult").innerHTML = `
    <p><b>Gross Salary:</b> ₹${data.grossSalary}</p>
    <p><b>Working Days:</b> ${data.workingDays}</p>
    <p><b>Present Days:</b> ${data.presentDays}</p>
    <p><b>LOP Days:</b> ${data.lopDays}</p>
    <p><b>LOP Amount:</b> ₹${data.lopAmount.toFixed(2)}</p>
    <p><b>Overtime Pay:</b> ₹${data.overtimePay}</p>
    <hr>
    <h3>Net Salary: ₹${data.netSalary.toFixed(2)}</h3>
  `;
}

/* ---------- LOCK PAYROLL ---------- */
async function lockPayroll() {
  const body = {
    employeeId: document.getElementById("lockEmpId").value,
    month: Number(document.getElementById("lockMonth").value),
    year: Number(document.getElementById("lockYear").value)
  };

  const res = await fetch(`${API}/lock-payroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  document.getElementById("lockMsg").innerText = data.message;
}
