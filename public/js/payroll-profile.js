// payroll-profile.js
// Used by both HR Admin & Employee pages

document.addEventListener('DOMContentLoaded', () => {

  const payrollForm = document.getElementById('payrollForm');

  /* =================================
     HR ADMIN: CREATE PAYROLL PROFILE
     ================================= */
  if (payrollForm) {
    payrollForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const employeeId = document.getElementById('employeeId').value;

      const data = {
        employeeId,

        salaryStructure: {
          basic: Number(document.getElementById('basic').value),
          hra: Number(document.getElementById('hra').value || 0),
          allowances: Number(document.getElementById('allowance').value || 0)
        },

        bankDetails: {
          bankName: document.getElementById('bankName').value,
          accountNumber: document.getElementById('accountNumber').value,
          ifsc: document.getElementById('ifscCode').value
        },

        taxDetails: {
          taxRegime: document.getElementById('taxRegime').value,
          panNumber: document.getElementById('panNumber').value
        }
      };

      try {
        const res = await fetch('/api/payroll-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await res.json();

        if (!res.ok) {
          alert(result.message || 'Error saving payroll profile');
          return;
        }

        // Store employeeId for employee view
        localStorage.setItem('employeeId', employeeId);

        alert('Payroll profile saved successfully');
        payrollForm.reset();

      } catch (err) {
        console.error(err);
        alert('Server error');
      }
    });
  }

  /* =================================
     EMPLOYEE / HR: VIEW PAYROLL PROFILE
     ================================= */
  const empName = document.getElementById('empName');

  if (empName) {
    const employeeId = localStorage.getItem('employeeId');

    if (!employeeId) {
      alert('Employee ID not found');
      return;
    }

    fetch(`/api/payroll-profile/${employeeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          alert(data.message);
          return;
        }

        // Employee info
        document.getElementById('empName').textContent = data.employeeId.name;
        document.getElementById('empEmail').textContent = data.employeeId.email;

        // Salary structure
        document.getElementById('basic').textContent = data.salaryStructure.basic;
        document.getElementById('hra').textContent = data.salaryStructure.hra;
        document.getElementById('allowance').textContent =
          data.salaryStructure.allowances;

        // Bank details
        document.getElementById('bankName').textContent =
          data.bankDetails.bankName;
        document.getElementById('accountNumber').textContent =
          data.bankDetails.accountNumber;
        document.getElementById('ifscCode').textContent =
          data.bankDetails.ifsc;

        // Tax details
        document.getElementById('taxRegime').textContent =
          data.taxDetails.taxRegime;
        document.getElementById('panNumber').textContent =
          data.taxDetails.panNumber || '-';
      })
      .catch(err => {
        console.error(err);
        alert('Unable to load payroll profile');
      });
  }

});
