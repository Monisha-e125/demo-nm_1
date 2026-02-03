const API = "http://localhost:8000/api/employee";

async function addEmployee() {
  const body = {
    employeeId: document.getElementById("empId").value,
    name: document.getElementById("name").value,
    department: document.getElementById("dept").value,
    designation: document.getElementById("desig").value,
    email: document.getElementById("email").value,
    joiningDate: document.getElementById("joinDate").value
  };

  const res = await fetch(`${API}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  document.getElementById("msg").innerText = data.message || data.error;
}
