class EmployeeManager {
  constructor() {
    this.employees = [];
    this.init();
  }

  async init() {
    await this.loadEmployees();
    this.render();
  }

  async loadEmployees() {
    const res = await fetch('/api/employees');
    const data = await res.json();
    this.employees = data.employees || [];
    this.render();
  }

  render() {
    const tbody = document.querySelector('#employee-list tbody');
    if (!this.employees.length) {
      tbody.innerHTML = '<tr><td colspan="6">No employees</td></tr>';
      return;
    }
    
    tbody.innerHTML = this.employees.map(emp => `
      <tr>
        <td>${emp.employeeId}</td>
        <td>${emp.name}</td>
        <td>${emp.email}</td>
        <td>${emp.department}</td>
        <td>${emp.basicSalary}</td>
        <td><span class="status-active">${emp.status}</span></td>
      </tr>
    `).join('');
  }
}

new EmployeeManager();
