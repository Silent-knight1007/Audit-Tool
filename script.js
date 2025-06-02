// === GLOBAL VARIABLES ===
let auditCounter = parseInt(localStorage.getItem('auditCounter')) || 1;
let editMode = false;
let editRow = null;
const ncCountersByAudit = {};

// === SECTION HANDLING ===
/*function showSection(id) {
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById(id).style.display = 'block';
}*/

// === NAVIGATION SECTION HANDLING ===
function showSection(id) {
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });
  const sectionToShow = document.getElementById(id);
  if (sectionToShow) {
    sectionToShow.style.display = 'block';
  }
}
window.onload = () => {
  showSection('dashboard-section');
};


// === AUDIT FORM ===
/*function createNewAudit() {
  document.getElementById('audit-form-container').style.display = 'block';

  // Format audit ID as "AUD-001", "AUD-002", etc.
  const paddedCounter = String(auditCounter).padStart(3, '0');
  const newAuditId = `AUD-${paddedCounter}`;

  // Set it in the form
  document.getElementById('audit-id').value = newAuditId;
}*/
/*function createNewAudit() {
  const auditFormContainer = document.getElementById('audit-form-container');
  auditFormContainer.style.display = 'block';

  // Auto-generate a new Audit ID
  const auditIdField = document.getElementById('audit-id');
  const newAuditId = `AUDIT-${auditCounter.toString().padStart(3, '0')}`;
  auditIdField.value = newAuditId;
}*/
function createNewAudit() {
  const auditFormContainer = document.getElementById('audit-form-container');
  const isVisible = auditFormContainer.style.display === 'block';
  auditFormContainer.style.display = isVisible ? 'none' : 'block';
  document.getElementById('audit-id').readOnly = true; // Or false if you want to allow editing when creating new


  if (!isVisible) {
    const auditIdField = document.getElementById('audit-id');
    const newAuditId = `AUD-${auditCounter.toString().padStart(3, '0')}`;
    auditIdField.value = newAuditId;
  }
}

function generateAuditId() {
  const auditIdInput = document.getElementById('audit-id');
  const paddedId = String(auditCounter).padStart(3, '0');
  const uniqueId = `AUD-${paddedId}`;
  auditIdInput.value = uniqueId;
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

  if (editMode && editRow) {
    // Update the existing row
    const cells = editRow.querySelectorAll('td');
    cells[0].textContent = auditId;
    cells[1].textContent = auditType;
    cells[2].textContent = standards;
    cells[3].textContent = leadAuditor;
    cells[4].textContent = location;
    cells[5].textContent = auditTeam;
    cells[6].textContent = plannedDate;
    cells[7].textContent = actualDate;
    cells[8].textContent = status;
    // No need to update the action buttons cell

    editMode = false;
    editRow = null;
  } else {
    // Create new row
    const tbody = document.getElementById('audit-table-body');
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
      <td>
      </td>
    `;
    tbody.appendChild(row);
    row.onclick = function() {
    let selected = document.querySelector('.selected-row');
    if (selected) selected.classList.remove('selected-row');
    row.classList.add('selected-row');
    document.getElementById('editBtn').disabled = false;
    document.getElementById('deleteBtn').disabled = false;
    };
    auditCounter++;
    localStorage.setItem('auditCounter', '1');
  }

  updateAuditIdDropdown();
  document.getElementById('audit-form').reset();
  document.getElementById('audit-form-container').style.display = 'none';
}


function editSelectedAudit() {
  let row = document.querySelector('.selected-row');
  if (row) {
    editAudit(row); // Make sure editAudit can accept a row
  }
}


function deleteSelectedAudit() {
  let row = document.querySelector('.selected-row');
  if (row) {
    row.remove();
    document.getElementById('editBtn').disabled = true;
    document.getElementById('deleteBtn').disabled = true;
  }
} 


function editAudit(row) {
  const row = button.closest('tr');
  const cells = row.querySelectorAll('td');
  document.getElementById('audit-form-container').style.display = 'block';
  document.getElementById('audit-id').value = cells[0].textContent;
  document.getElementById('audit-type').value = cells[1].textContent;
  document.getElementById('audit-id').readOnly = true;
  // Set Standards (multi-select)
  const standardsSelect = document.getElementById('standards');
  const standardsArray = cells[2].textContent.split(',').map(s => s.trim());
  Array.from(standardsSelect.options).forEach(option => {
  option.selected = standardsArray.includes(option.value);
  });
  document.getElementById('lead-auditor').value = cells[3].textContent;
  document.getElementById('location').value = cells[4].textContent;
  document.getElementById('audit-team').value = cells[5].textContent;
  document.getElementById('planned-date').value = cells[6].textContent;
  document.getElementById('actual-date').value = cells[7].textContent;
  document.getElementById('status').value = cells[8].textContent;
  editMode = true;
  editRow = row;
}


function editAuditFromLink(link) {
  const row = link.closest('tr');
  editAudit(row.querySelector('button[onclick^="editAudit"]'));
}



// === NON-CONFORMITY FORM ===
function createNewNC() {
  const auditId = document.getElementById('nc-audit-id').value;
  if (!auditId) {
    alert("Please select an Audit ID before creating a Non-Conformity.");
    return;
  }
  if (!ncCountersByAudit[auditId]) {
    ncCountersByAudit[auditId] = 1;
  }
  const ncId = `${auditId}_NC_${String(ncCountersByAudit[auditId]).padStart(3, '0')}`;
  document.getElementById('nc-id').value = ncId;
  ncCountersByAudit[auditId]++;
}



function updateDueDate() {
  const type = document.getElementById('nc-type').value;
  const today = new Date();
  let dueDate = new Date(today);

  if (type === 'Minor') dueDate.setDate(today.getDate() + 30);
  else if (type === 'Major') dueDate.setDate(today.getDate() + 15);
  else if (type === 'Critical') dueDate.setDate(today.getDate() + 7);

  document.getElementById('due-date').value = dueDate.toISOString().split('T')[0];
}



function saveNC() {
  const ncId = document.getElementById('nc-id').value;
  const auditId = document.getElementById('nc-audit-id').value;
  const description = document.getElementById('description').value;
  const clause = document.getElementById('clause').value;
  const type = document.getElementById('nc-type').value;
  const dueDate = document.getElementById('due-date').value;
  const department = document.getElementById('nc-department').value;
  const person = document.getElementById('responsible-person').value;
  const location = document.getElementById('location-nc').value;
  const corrective = document.getElementById('corrective-action').value;
  const preventive = document.getElementById('preventive-action').value;
  const root = document.getElementById('root-cause').value;
  const status = document.getElementById('status-nc').value;

  if (!auditId || !ncId || !description || !clause || !type || !dueDate) {
    alert("Please fill in all required fields.");
    return;
  }

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${ncId}</td>
    <td>${auditId}</td>
    <td>${description}</td>
    <td>${clause}</td>
    <td>${type}</td>
    <td>${dueDate}</td>
    <td>${department}</td>
    <td>${person}</td>
    <td>${location}</td>
    <td>${corrective}</td>
    <td>${preventive}</td>
    <td>${root}</td>
    <td>${status}</td>
    <td>
      <button class="button is-small is-warning" onclick="editNC(this)">Edit</button>
      <button class="button is-small is-danger" onclick="deleteRow(this)">Delete</button>
    </td>
  `;
  document.getElementById('nc-table-body').appendChild(row);
  document.getElementById('nc-form').reset();
}



function editNC(button) {
  const row = button.closest('tr');
  const cells = row.querySelectorAll('td');

  document.getElementById('nc-id').value = cells[0].textContent;
  document.getElementById('nc-audit-id').value = cells[1].textContent;
  document.getElementById('description').value = cells[2].textContent;
  document.getElementById('clause').value = cells[3].textContent;
  document.getElementById('nc-type').value = cells[4].textContent;
  document.getElementById('due-date').value = cells[5].textContent;
  document.getElementById('nc-department').value = cells[6].textContent;
  document.getElementById('responsible-person').value = cells[7].textContent;
  document.getElementById('location-nc').value = cells[8].textContent;
  document.getElementById('corrective-action').value = cells[9].textContent;
  document.getElementById('preventive-action').value = cells[10].textContent;
  document.getElementById('root-cause').value = cells[11].textContent;
  document.getElementById('status-nc').value = cells[12].textContent;

  row.remove();
}

function deleteRow(button) {
  button.closest('tr').remove();
}



function updateAuditIdDropdown() {
  const select = document.getElementById('nc-audit-id');
  const tbody = document.getElementById('audit-table-body');
  select.innerHTML = '<option value="">Select Audit ID</option>';
  const auditIds = new Set();
  Array.from(tbody.children).forEach(row => {
    const auditId = row.children[0]?.textContent;
    if (auditId) auditIds.add(auditId);
  });
  auditIds.forEach(id => {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = id;  
    select.appendChild(option);
  });
}



document.addEventListener('DOMContentLoaded', function () {
  new Choices('#standards', {
    removeItemButton: true,
    placeholderValue: 'Select standards',
    searchEnabled: true
  });
});


