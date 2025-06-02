/*27-05-2025*/
let auditCounter = 1;
    let ncCounter = 1;
    let selectedAuditRow = null;
    let selectedNCRow = null;


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

  // 🟨 If editing, just update the selected row
  if (selectedAuditRow) {
    const cells = selectedAuditRow.querySelectorAll('td');
    cells[0].innerHTML = `<a href="#" onclick="editAuditFromLink(this)">${auditId}</a>`;
    cells[1].innerText = auditType;
    cells[2].innerText = standards;
    cells[3].innerText = leadAuditor;
    cells[4].innerText = location;
    cells[5].innerText = auditTeam;
    cells[6].innerText = plannedDate;
    cells[7].innerText = actualDate;
    cells[8].innerText = status;

    selectedAuditRow = null; // reset edit mode
    document.getElementById('deleteBtn').disabled = true;
  } else {
    // 🟩 Create a brand new row
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><a href="#" onclick="editAuditFromLink(this)">${auditId}</a></td>
      <td>${auditType}</td>
      <td>${standards}</td>
      <td>${leadAuditor}</td>
      <td>${location}</td>
      <td>${auditTeam}</td>
      <td>${plannedDate}</td>
      <td>${actualDate}</td>
      <td>${status}</td>
    `;
    row.onclick = () => selectRowForEdit(row);
    document.getElementById('audit-table-body').appendChild(row);
    auditCounter++;
  }
   updateNCAuditDropdown();
  document.getElementById('audit-form').reset();
  document.getElementById('audit-form-container').style.display = 'none';

  

}

function updateNCAuditDropdown() {
  const auditId = document.getElementById('audit-id').value;
  const dropdown = document.getElementById('nc-audit-id');

  // Check if already exists
  const exists = Array.from(dropdown.options).some(opt => opt.value === auditId);

  if (!exists && auditId !== "") {
    const option = document.createElement('option');
    option.value = auditId;
    option.textContent = auditId;
    dropdown.appendChild(option);
  }
  console.log("Audit ID to add to NC:", auditId);

}

function selectRowForEdit(row) {
  selectedAuditRow = row;
  const cells = row.querySelectorAll('td');

  document.getElementById('audit-form-container').style.display = 'block';
  document.getElementById('audit-id').value = cells[0].innerText;
  document.getElementById('audit-type').value = cells[1].innerText;

  const standards = cells[2].innerText.split(', ');
  const select = document.getElementById('standards');
  Array.from(select.options).forEach(option => {
    option.selected = standards.includes(option.value);
  });

  document.getElementById('lead-auditor').value = cells[3].innerText;
  document.getElementById('location').value = cells[4].innerText;
  document.getElementById('audit-team').value = cells[5].innerText;
  document.getElementById('planned-date').value = cells[6].innerText;
  document.getElementById('actual-date').value = cells[7].innerText;
  document.getElementById('status').value = cells[8].innerText;

  // Enable buttons
  document.getElementById('deleteBtn').disabled = false;
}

function updateAudit() {
  if (!selectedAuditRow) return;

  const cells = selectedAuditRow.querySelectorAll('td');
  cells[0].innerHTML = `<a href="#" onclick="editAuditFromLink(this)">${document.getElementById('audit-id').value}</a>`;
  cells[1].innerText = document.getElementById('audit-type').value;
  cells[2].innerText = Array.from(document.getElementById('standards').selectedOptions).map(o => o.value).join(', ');
  cells[3].innerText = document.getElementById('lead-auditor').value;
  cells[4].innerText = document.getElementById('location').value;
  cells[5].innerText = document.getElementById('audit-team').value;
  cells[6].innerText = document.getElementById('planned-date').value;
  cells[7].innerText = document.getElementById('actual-date').value;
  cells[8].innerText = document.getElementById('status').value;

  selectedAuditRow = null;
  document.getElementById('deleteBtn').disabled = true;
  document.getElementById('audit-form').reset();
  document.getElementById('audit-form-container').style.display = 'none';
}

function deleteAudit() {
  if (!selectedAuditRow) return;

  if (confirm("Are you sure you want to delete this audit?")) {
    selectedAuditRow.remove();
    selectedAuditRow = null;
    document.getElementById('deleteBtn').disabled = true;
    document.getElementById('audit-form').reset();
    document.getElementById('audit-form-container').style.display = 'none';
  }
}


    function editAuditRow(button) {
        const row = button.closest('tr');
        const cells = row.querySelectorAll('td');

        document.getElementById('audit-form-container').style.display = 'block';
        document.getElementById('audit-id').value = cells[0].innerText;
        document.getElementById('audit-type').value = cells[1].innerText;

        const selectedStandards = cells[2].innerText.split(', ');
        const standardsSelect = document.getElementById('standards');
        Array.from(standardsSelect.options).forEach(option => {
        option.selected = selectedStandards.includes(option.value);
        });

        document.getElementById('lead-auditor').value = cells[3].innerText;
        document.getElementById('location').value = cells[4].innerText;
        document.getElementById('audit-team').value = cells[5].innerText;
        document.getElementById('planned-date').value = cells[6].innerText;
        document.getElementById('actual-date').value = cells[7].innerText;
        document.getElementById('status').value = cells[8].innerText;

        row.remove(); // Remove old row to avoid duplicate after re-saving
}

    function editAuditFromLink(link) {
  const row = link.closest('tr');
  selectRowForEdit(row);
}


    function deleteAuditRow(button) {
  if (confirm("Are you sure you want to delete this audit?")) {
    button.closest('tr').remove();
    }
}


function createNewNC() {
  const formContainer = document.getElementById('nc-form-container');
  const isVisible = formContainer.style.display === 'block';

  // Toggle form
  formContainer.style.display = isVisible ? 'none' : 'block';

  if (!isVisible) {
    // Just show blank form first
    document.getElementById('nc-form').reset();
    selectedNCRow = null;

    // Set default NC ID if Audit ID selected
    const auditId = document.getElementById('nc-audit-id').value;
    if (auditId) {
      const ncId = `${auditId}_NC_${String(ncCounter).padStart(3, '0')}`;
      document.getElementById('nc-id').value = ncId;

      generateNCId();
      
    } else {
      // Leave NC ID blank; show user-friendly hint instead
      document.getElementById('nc-id').value = '';
    }

    // Disable edit/delete until needed
    document.getElementById('deleteBtnNC').disabled = true;
  }
}

function generateNCId() {
  const auditId = document.getElementById('nc-audit-id').value;
  if (!auditId) {
    document.getElementById('nc-id').value = ''; // clear if nothing selected
    return;
  }

  // Count how many NCs already exist for this audit to generate next number
  const rows = document.querySelectorAll('#nc-table-body tr');
  let maxCounter = 0;
  rows.forEach(row => {
    const ncId = row.cells[0].innerText; // e.g. AUD-001_NC_001
    if (ncId.startsWith(auditId + '_NC_')) {
      const numPart = ncId.split('_NC_')[1];
      const num = parseInt(numPart, 10);
      if (num > maxCounter) maxCounter = num;
    }
  });

  const nextCounter = maxCounter + 1;
  const newNcId = `${auditId}_NC_${String(nextCounter).padStart(3, '0')}`;
  document.getElementById('nc-id').value = newNcId;
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
  const description = document.getElementById('description').value;
  const clause = document.getElementById('clause').value;
  const type = document.getElementById('nc-type').value;
  const dueDate = document.getElementById('due-date').value;

  if (!auditId || !ncId || !description || !clause || !type || !dueDate) {
    alert("Please fill in all required fields.");
    return;
  }

  // ✅ If editing, update the existing row
  if (selectedNCRow) {
    const cells = selectedNCRow.querySelectorAll('td');
    cells[0].innerHTML = `<a href="#" onclick="editNCFromLink(this)">${ncId}</a>`;
    cells[1].innerText = auditId;
    cells[2].innerText = description;
    cells[3].innerText = clause;
    cells[4].innerText = type;
    cells[5].innerText = dueDate;

    selectedNCRow = null;
    document.getElementById('deleteBtnNC').disabled = true;
  } else {
    // ✅ Create a new row
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><a href="#" onclick="editNCFromLink(this)">${ncId}</a></td>
      <td>${auditId}</td>
      <td>${description}</td>
      <td>${clause}</td>
      <td>${type}</td>
      <td>${dueDate}</td>
    `;
    row.onclick = () => selectNCRowForEdit(row);
    document.getElementById('nc-table-body').appendChild(row);
    ncCounter++;
  }

  if (!auditId) {
  alert("Please select an Audit ID before saving Non-Conformity.");
  return;
}

  generateNCId();
  document.getElementById('nc-form').reset();
  document.getElementById('nc-form-container').style.display = 'none';
}


function selectNCRowForEdit(row) {
  selectedNCRow = row;
  const cells = row.querySelectorAll('td');

  document.getElementById('nc-form-container').style.display = 'block';
  document.getElementById('nc-id').value = cells[0].innerText;
  document.getElementById('nc-audit-id').value = cells[1].innerText;
  document.getElementById('description').value = cells[2].innerText;
  document.getElementById('clause').value = cells[3].innerText;
  document.getElementById('nc-type').value = cells[4].innerText;
  document.getElementById('due-date').value = cells[5].innerText;

  document.getElementById('deleteBtnNC').disabled = false;
}

function editNCFromLink(link) {
  const row = link.closest('tr');
  selectNCRowForEdit(row);
}

function deleteNC() {
  if (selectedNCRow && confirm("Are you sure you want to delete this NC?")) {
    selectedNCRow.remove();
    selectedNCRow = null;
    document.getElementById('deleteBtnNC').disabled = true;
    document.getElementById('nc-form').reset();
    document.getElementById('nc-form-container').style.display = 'none';
  }
}


document.addEventListener('DOMContentLoaded', function () {
    new Choices('#standards', {
        removeItemButton: true,
        placeholderValue: 'Select standards',
        searchEnabled: true
    });
    document.getElementById('nc-audit-id').addEventListener('change', function() {
         generateNCId(); 
    });

});