function calculateSalary() {
  const basic = parseFloat(document.getElementById("basic").value) || 0;
  const hra = parseFloat(document.getElementById("hra").value) || 0;
  const allowance = parseFloat(document.getElementById("allowance").value) || 0;

  const grossSalary = basic + hra + allowance;
  const pf = basic * 0.12;
  const netSalary = grossSalary - pf;

  document.getElementById("gross").innerText = grossSalary.toFixed(2);
  document.getElementById("pf").innerText = pf.toFixed(2);
  document.getElementById("net").innerText = netSalary.toFixed(2);
}
