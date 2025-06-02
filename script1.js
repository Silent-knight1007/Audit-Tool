/*26-05-2025*/
let auditCounter = 1;
    let ncCounter = 1;

    function showSection(id) {
      document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
      });
      document.getElementById(id).style.display = 'block';
    }

    function createNewAudit() {
  const form = document.getElementById('audit-form-container');
  const isVisible = form.style.display === 'block';
  form.style.display = isVisible ? 'none' : 'block';
  if (!isVisible) {
    document.getElementById('audit-id').value = `AUD-${String(auditCounter).padStart(3, '0')}`;
  }
}

    function saveAudit() {
      const auditId = document.getElementById('audit-id').value;
      const auditType = document.getElementById('audit-type').value;
      const standards = Array.from(document.getElementById('standards').selectedOptions).map(o => o.value).join(', ');
      const leadAuditor = document.getElementById('lead-auditor').value;
      const location = document.getElementById('location').value;
      const auditTeam = document.getElementById('audit-team').value;
      const plannedDate = document.getElementById('planned-date').value;
      const actualDate = document.getElementById('actual-date').value;
      const status = document.getElementById('status').value;

      const row = document.createElement('tr');
      row.innerHTML = `<td>${auditId}</td>
      <td>${auditType}</td>
      <td>${standards}</td>
      <td>${leadAuditor}</td>
      <td>${location}</td>
      <td>${auditTeam}</td>
      <td>${plannedDate}</td>
      <td>${actualDate}</td>
      <td>${status}</td>`;
      document.getElementById('audit-table-body').appendChild(row);
      document.getElementById('audit-form').reset();
      document.getElementById('audit-form-container').style.display = 'none';
      auditCounter++;
    }

    function createNewNC() {
  const form = document.getElementById('nc-form');
  const isVisible = form.style.display === 'block';
  form.style.display = isVisible ? 'none' : 'block';

  const auditId = document.getElementById('nc-audit-id').value;
  if (!auditId) {
    alert("Please enter Audit ID first.");
    return;
  }
  if (!isVisible) {
    const ncId = `${auditId}_NC_${String(ncCounter).padStart(3, '0')}`;
    document.getElementById('nc-id').value = ncId;
  }
}

    function updateDueDate() {
      const type = document.getElementById('nc-type').value;
      const today = new Date();
      const due = new Date(today);
      if (type === "Minor") due.setDate(today.getDate() + 30);
      if (type === "Major") due.setDate(today.getDate() + 15);
      document.getElementById('due-date').value = due.toISOString().split("T")[0];
    }

    function saveNC() {
      const ncId = document.getElementById('nc-id').value;
      const auditId = document.getElementById('nc-audit-id').value;
      const desc = document.getElementById('description').value;
      const clause = document.getElementById('clause').value;
      const type = document.getElementById('nc-type').value;
      const due = document.getElementById('due-date').value;

      const row = document.createElement('tr');
      row.innerHTML = `<td>${ncId}</td>
      <td>${auditId}</td>
      <td>${desc}</td>
      <td>${clause}</td>
      <td>${type}</td>
      <td>${due}</td>`;
      document.getElementById('nc-table-body').appendChild(row);
      document.getElementById('nc-form').reset();
      ncCounter++;
    }

    document.addEventListener('DOMContentLoaded', function () {
      new Choices('#standards', {
        removeItemButton: true,
        placeholderValue: 'Select standards',
        searchEnabled: true
      });
    });