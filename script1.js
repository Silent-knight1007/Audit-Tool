/* 03-06-2025 */

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

    // AUDIT JAVASCRIPT--------->

function createNewAudit() {
  const form = document.getElementById('audit-form-container');
  const isVisible = form.style.display === 'block';

  form.style.display = isVisible ? 'none' : 'block';

  if (!isVisible && !selectedAuditRow) {
    document.getElementById('audit-id').value = `AUD-${String(auditCounter).padStart(3, '0')}`;
  }

  document.getElementById('saveBtn').innerText = selectedAuditRow ? 'Update' : 'Save';
}

function saveAudit() {
if (
  !document.getElementById('audit-id').value ||
  !document.getElementById('audit-type').value ||
  !Array.from(document.getElementById('standards').selectedOptions).length ||
  !document.getElementById('lead-auditor').value ||
  !document.getElementById('location').value ||
  !document.getElementById('audit-team').value ||
  !document.getElementById('planned-date').value ||
  !document.getElementById('actual-date').value ||
  !document.getElementById('status').value
) {
  alert("Please fill all required fields before saving.");
  return;
}
  const auditId = document.getElementById('audit-id').value;
  const auditType = document.getElementById('audit-type').value;
  const standards = Array.from(document.getElementById('standards').selectedOptions).map(o => o.value).join(', ');
  const leadAuditor = document.getElementById('lead-auditor').value;
  const location = document.getElementById('location').value;
  const auditTeam = document.getElementById('audit-team').value;
  const plannedDate = document.getElementById('planned-date').value;
  const actualDate = document.getElementById('actual-date').value;
  const status = document.getElementById('status').value;


  if (selectedAuditRow) {
    // ✅ Update existing row
    if (selectedAuditRow) {
    const cells = selectedAuditRow.querySelectorAll('td');

    // Audit ID (cell 1)
    const auditIdInput = document.getElementById('audit-id').value;
    const currentAuditId = cells[1].innerText;
    cells[1].innerHTML = `<a href="#" onclick="editAuditFromLink(this)">${auditIdInput || currentAuditId}</a>`;

    // Audit Type (cell 2)
    const auditTypeInput = document.getElementById('audit-type').value;
    cells[2].innerText = auditTypeInput || cells[2].innerText;

    // Standards (cell 3)
    const standardsInput = Array.from(document.getElementById('standards').selectedOptions).map(opt => opt.value).join(', ');
    cells[3].innerText = standardsInput || cells[3].innerText;

    // Lead Auditor (cell 4)
    const leadAuditorInput = document.getElementById('lead-auditor').value;
    cells[4].innerText = leadAuditorInput || cells[4].innerText;

    // Location (cell 5)
    const locationInput = document.getElementById('location').value;
    cells[5].innerText = locationInput || cells[5].innerText;

    // Audit Team (cell 6)
    const auditTeamInput = document.getElementById('audit-team').value;
    cells[6].innerText = auditTeamInput || cells[6].innerText;

    // Planned Date (cell 7)
    const plannedDateInput = document.getElementById('planned-date').value;
    cells[7].innerText = plannedDateInput || cells[7].innerText;

    // Actual Date (cell 8)
    const actualDateInput = document.getElementById('actual-date').value;
    cells[8].innerText = actualDateInput || cells[8].innerText;

    // Status (cell 9)
    const statusInput = document.getElementById('status').value;
    cells[9].innerText = statusInput || cells[9].innerText;

    selectedAuditRow = null;
    document.getElementById('audit-form').reset();
    document.getElementById('audit-form-container').style.display = 'none';
    document.getElementById('saveBtn').innerText = 'Save';
    updateNCAuditDropdown();
    return;
}
  } else {
    // ✅ Create new row
    const row = document.createElement('tr');
    row.innerHTML = `
    <td><input type="checkbox" name="audit-checkbox" value="${auditId}"></td>
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
    // Attach event listener to the checkbox inside this row
    const checkbox = row.querySelector('input[name="audit-checkbox"]');
    checkbox.addEventListener('change', updateDeleteButtonState);

    auditCounter++; // ✅ Only increase on new row
  }
  updateNCAuditDropdown();
  document.getElementById('audit-form').reset();
  document.getElementById('audit-form-container').style.display = 'none';
  document.getElementById('saveBtn').innerText = 'Save';
}

function updateDeleteButtonState() {
  const checkboxes = document.querySelectorAll('input[name="audit-checkbox"]');
  const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
  document.getElementById('delete-selected-btn').disabled = !anyChecked;

  // Also update the Select All checkbox state (checked, unchecked, indeterminate)
  const selectAllCheckbox = document.getElementById('select-all-checkbox');
  if (!selectAllCheckbox) return;
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  const noneChecked = Array.from(checkboxes).every(cb => !cb.checked);
  if (allChecked) {
    selectAllCheckbox.checked = true;
    selectAllCheckbox.indeterminate = false;
  } else if (noneChecked) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = true;
  }
}

function deleteSelectedAudits() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  checkboxes.forEach((checkbox) => {
    const row = checkbox.closest('tr');
    if (row) row.remove();
  });
  document.getElementById("delete-selected-btn").disabled = true;
}

function handleCheckboxChange() {
  const anyChecked = document.querySelectorAll(".audit-checkbox:checked").length > 0;
  document.getElementById("delete-selected-btn").disabled = !anyChecked;
}

function cancelAudit() {
  if (confirm("Are you sure you want to cancel filling this form?")) {
    document.getElementById("audit-form").reset();
    document.getElementById("audit-form-container").style.display = "none";
    selectedAuditRow = null;
    document.getElementById('saveBtn').innerText = 'Save';
  }
}

function cancelEdit() {
  // Hide the form
  document.getElementById('auditFormContainer').style.display = 'none';

  // Clear all input fields
  clearAuditForm();

  // Stop editing any row
  selectedAuditRow = null;

  // Change the Save button text back to "Save"
  document.getElementById('saveBtn').innerText = 'Save';

  console.log('Cancelled edit, form reset.');
}

function showAuditForm() {
  // Show the form
  document.getElementById('auditFormContainer').style.display = 'block';

  // Clear form fields
  clearAuditForm();

  // Stop editing anything
  selectedAuditRow = null;

  // Change Save button to "Save"
  document.getElementById('saveBtn').innerText = 'Save';

  console.log('Form opened for new audit.');
}

function selectRowForEdit(row) {
  selectedAuditRow = row;
  const cells = row.querySelectorAll('td');

  document.getElementById('audit-form-container').style.display = 'block';
  document.getElementById('audit-id').value = cells[1].innerText;
  document.getElementById('audit-type').value = cells[2].innerText;

  const standards = cells[3].innerText.split(',');
  const select = document.getElementById('standards');
  Array.from(select.options).forEach(option => {
    option.selected = standards.includes(option.value);
  });

  document.getElementById('lead-auditor').value = cells[4].innerText;
  document.getElementById('location').value = cells[5].innerText;
  document.getElementById('audit-team').value = cells[6].innerText;
  document.getElementById('planned-date').value = cells[7].innerText;
  document.getElementById('actual-date').value = cells[8].innerText;
  document.getElementById('status').value = cells[9].innerText;

  // Enable buttons
   document.getElementById('saveBtn').innerText = 'Update';
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

       // row.remove(); // Remove old row to avoid duplicate after re-saving
}

function editAuditFromLink(link) {
  const row = link.closest('tr');
  selectRowForEdit(row);
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

function deleteAuditRow(button) {
  if (confirm("Are you sure you want to delete this audit?")) {
    button.closest('tr').remove();
    }
}


   // NON-CONFORMITY JAVASCRIPT------------>

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
  document.getElementById('saveBtn').innerText = selectedNCRow ? 'Update' : 'Save';
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

}

function updateDueDate() {
      const type = document.getElementById('nc-type').value;
      const today = new Date();
      const due = new Date(today);
      if (type === "Minor") due.setDate(today.getDate() + 30);
      if (type === "Major") due.setDate(today.getDate() + 15);
      document.getElementById('due-date').value = due.toISOString().split("T")[0];
}

function editNCFromLink(link) {
  const row = link.closest('tr');
  selectNCRowForEdit(row);
}

function updateNC() {
  if (!selectedNCRow) return;

  const cells = selectedNCRow.querySelectorAll('td');
  // cells[0] is the checkbox cell, so start from cells[1]
  cells[1].innerHTML = `<a href="#" onclick="editNCFromLink(this)">${document.getElementById('nc-id').value}</a>`;
  cells[2].innerText = document.getElementById('nc-audit-id').value;
  cells[3].innerText = document.getElementById('description').value;
  cells[4].innerText = document.getElementById('clause').value;
  cells[5].innerText = document.getElementById('nc-type').value;
  cells[6].innerText = document.getElementById('due-date').value;
  cells[7].innerText = document.getElementById('nc-department').value;
  cells[8].innerText = document.getElementById('nc-Responsible-Person').value;
  cells[9].innerText = document.getElementById('nc-Responsible-Person-Email').value;
  cells[10].innerText = document.getElementById('Location').value;
  cells[11].innerText = document.getElementById('corrective-action').value;
  cells[12].innerText = document.getElementById('preventive-action').value;
  cells[13].innerText = document.getElementById('root-cause').value;
  cells[14].innerText = document.getElementById('status-nc').value;

  selectedNCRow = null;
  document.getElementById('deleteBtnNC').disabled = true;
  document.getElementById('nc-form').reset();
  document.getElementById('nc-form-container').style.display = 'none';
}

function selectNCRowForEdit(row) {
  selectedNCRow = row;
  const cells = row.querySelectorAll('td');

  document.getElementById('nc-form-container').style.display = 'block';
  // Get NC ID from the <a> tag inside cell[1]
  document.getElementById('nc-id').value = cells[1].querySelector('a').innerText;
  document.getElementById('nc-audit-id').value = cells[2].innerText;
  document.getElementById('description').value = cells[3].innerText;
  document.getElementById('clause').value = cells[4].innerText;
  document.getElementById('nc-type').value = cells[5].innerText;
  document.getElementById('due-date').value = cells[6].innerText;
  document.getElementById('nc-department').value = cells[7].innerText;
  document.getElementById('nc-Responsible-Person').value = cells[8].innerText;
  document.getElementById('nc-Responsible-Person-Email').value = cells[9].innerText;
  document.getElementById('Location').value = cells[10].innerText;
  document.getElementById('corrective-action').value = cells[11].innerText;
  document.getElementById('preventive-action').value = cells[12].innerText;
  document.getElementById('root-cause').value = cells[13].innerText;
  document.getElementById('status-nc').value = cells[14].innerText;
  document.getElementById('deleteBtnNC').disabled = false;
}


function editNCRow(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');

    // Show the NC form
    document.getElementById('nc-form-container').style.display = 'block';

    // Set global selected row for later update
    selectedNCRow = row;

    // Fill form fields from the row's cells
    document.getElementById('nc-id').value = cells[1].querySelector('a').innerText;
    document.getElementById('nc-audit-id').value = cells[2].innerText;
    document.getElementById('description').value = cells[3].innerText;
    document.getElementById('clause').value = cells[4].innerText;
    document.getElementById('nc-type').value = cells[5].innerText;
    document.getElementById('due-date').value = cells[6].innerText;
    document.getElementById('nc-department').value = cells[7].innerText;
    document.getElementById('nc-Responsible-Person').value = cells[8].innerText;
    document.getElementById('nc-Responsible-Person-Email').value = cells[9].innerText;
    document.getElementById('Location').value = cells[10].innerText;
    document.getElementById('corrective-action').value = cells[11].innerText;
    document.getElementById('preventive-action').value = cells[12].innerText;
    document.getElementById('root-cause').value = cells[13].innerText;
    document.getElementById('status-nc').value = cells[14].innerText;

    // Enable delete button if you have one
    document.getElementById('deleteBtnNC').disabled = false;
}

function cancelNC() {
  if (confirm("Are you sure you want to cancel filling this form?")) {
    document.getElementById("nc-form").reset();
    document.getElementById("nc-form-container").style.display = "none";
    selectedAuditRow = null;
    document.getElementById('saveBtn').innerText = 'Save';
  }
}

function cancelEdit() {
  // Hide the form
  document.getElementById('ncFormContainer').style.display = 'none';

  // Clear all input fields
  clearNCForm();

  // Stop editing any row
  selectedNCRow = null;

  // Change the Save button text back to "Save"
  document.getElementById('saveBtn').innerText = 'Save';

  console.log('Cancelled edit, form reset.');
}

function showNCForm() {
  // Show the form
  document.getElementById('ncFormContainer').style.display = 'block';

  // Clear form fields
  clearNCForm();

  // Stop editing anything
  selectedAuditRow = null;

  // Change Save button to "Save"
  document.getElementById('saveBtn').innerText = 'Save';

  console.log('Form opened for new nc.');
}

function handleCheckboxChange() {
  const anyChecked = document.querySelectorAll(".nc-checkbox:checked").length > 0;
  document.getElementById("delete-selected-btn").disabled = !anyChecked;
}

function saveNC() {

if (
  !document.getElementById('nc-audit-id').value ||
  !document.getElementById('nc-id').value ||
  !document.getElementById('description').value ||
  !document.getElementById('clause').value ||
  !document.getElementById('nc-type').value ||
  !document.getElementById('due-date').value ||
  !document.getElementById('nc-department').value ||
  !document.getElementById('nc-Responsible-Person').value||
  !document.getElementById('nc-Responsible-Person-Email').value||
  !document.getElementById('Location').value||
  !document.getElementById('corrective-action').value||
  !document.getElementById('preventive-action').value||
  !document.getElementById('root-cause').value||
  !document.getElementById('status-nc').value
) 
{
  alert("Please fill all  required fields before saving.");
  return;
}
  const ncId = document.getElementById('nc-id').value;
  const auditId = document.getElementById('nc-audit-id').value;
  const description = document.getElementById('description').value;
  const clause = document.getElementById('clause').value;
  const type = document.getElementById('nc-type').value;
  const dueDate = document.getElementById('due-date').value;
  const department = document.getElementById('nc-department').value;
  const responsibleperson = document.getElementById('nc-Responsible-Person').value;
  const responsiblepersonemail = document.getElementById('nc-Responsible-Person-Email').value;
  const location = document.getElementById('Location').value;
  const correctiveaction = document.getElementById('corrective-action').value;
  const preventiveaction = document.getElementById('preventive-action').value;
  const rootcause = document.getElementById('root-cause').value;
  const status = document.getElementById('status-nc').value;

  // ✅ Update existing row
  if (selectedNCRow) {
    const cells = selectedNCRow.querySelectorAll('td');

    // NC ID (cell 1 - skip checkbox cell 0)
    cells[1].innerHTML = `<a href="#" onclick="editNCFromLink(this)">${ncId}</a>`;
    
    // Audit ID (cell 2)
    cells[2].innerText = auditId;
    
    // Description (cell 3)
    cells[3].innerText = description;
    
    // Clause No (cell 4)
    cells[4].innerText = clause;
    
    // NC-Type (cell 5)
    cells[5].innerText = type;
    
    // Due Date (cell 6)
    cells[6].innerText = dueDate;
    
    // Department (cell 7)
    cells[7].innerText = department;
    
    // Responsible Person (cell 8)
    cells[8].innerText = responsibleperson;
    
    // Responsible Person Email (cell 9)
    cells[9].innerText = responsiblepersonemail;
    
    // Location (cell 10)
    cells[10].innerText = location;
    
    // Corrective Action (cell 11)
    cells[11].innerText = correctiveaction;
    
    // Preventive Action (cell 12)
    cells[12].innerText = preventiveaction;
    
    // Root Cause (cell 13)
    cells[13].innerText = rootcause;
    
    // Status (cell 14)
    cells[14].innerText = status;

    selectedNCRow = null;
    document.getElementById('nc-form').reset();
    document.getElementById('nc-form-container').style.display = 'none';
    document.getElementById('saveBtn').innerText = 'Save';
    updateNCAuditDropdown();
    return;
  }
  // ✅ Create new row
  else {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="checkbox" class="nc-checkbox"></td>
      <td><a href="#" onclick="editNCFromLink(this)">${ncId}</a></td>
      <td>${auditId}</td>
      <td>${description}</td>
      <td>${clause}</td>
      <td>${type}</td>
      <td>${dueDate}</td>
      <td>${department}</td>
      <td>${responsibleperson}</td>
      <td>${responsiblepersonemail}</td>
      <td>${location}</td>
      <td>${correctiveaction}</td>
      <td>${preventiveaction}</td>
      <td>${rootcause}</td>
      <td>${status}</td>
    `;
    document.getElementById('nc-table-body').appendChild(row);
  }
    row.onclick = () => selectNCRowForEdit(row);
    document.getElementById('nc-table-body').appendChild(row);
    // Attach event listener to the checkbox inside this row
    const checkbox = row.querySelector('input[name="nc-checkbox"]');
    checkbox.addEventListener('change', updateDeleteButtonState);
    ncCounter++;

    generateNCId();
    selectedNCRow = null;
    document.getElementById('nc-form').reset();
    document.getElementById('nc-form-container').style.display = 'none';
    document.getElementById('saveBtn').innerText = 'Save';
    updateNCAuditDropdown(); 
}

function updateDeleteButtonState() {
  const checkboxes = document.querySelectorAll('input[name="nc-checkbox"]');
  const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
  document.getElementById('delete-selected-btn').disabled = !anyChecked;

  // Also update the Select All checkbox state (checked, unchecked, indeterminate)
  const selectAllCheckbox = document.getElementById('nc-select-all');
  if (!selectAllCheckbox) return;
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  const noneChecked = Array.from(checkboxes).every(cb => !cb.checked);
  if (allChecked) {
    selectAllCheckbox.checked = true;
    selectAllCheckbox.indeterminate = false;
  } else if (noneChecked) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = true;
  }
}

function deleteSelectedNC() {
  const checkboxes = document.querySelectorAll('.nc-checkbox:checked');
  if (checkboxes.length === 0) {
    alert("Please select at least one NC to delete.");
    return;
  }
  if (!confirm("Are you sure you want to delete the selected NC(s)?")) return;
  checkboxes.forEach(cb => cb.closest('tr').remove());
  // Optionally, uncheck master checkbox
  document.getElementById('nc-select-all').checked = false;
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

function deleteNCRow(button) {
  if (confirm("Are you sure you want to delete this Non-Conformity?")) {
    button.closest('tr').remove();
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

document.getElementById('select-all-checkbox').addEventListener('change', function() {
  const checked = this.checked;
  const checkboxes = document.querySelectorAll('input[name="audit-checkbox"]');
  checkboxes.forEach(cb => cb.checked = checked);
  updateDeleteButtonState();
});

document.getElementById('nc-select-all').addEventListener('change', function() {
  const checked = this.checked;
  document.querySelectorAll('.nc-checkbox').forEach(cb => cb.checked = checked);
});


/*const data = [
      { id: 'AUD001', date: '2024-06-01' },
      { id: 'AUD002', date: '2024-06-02' },
      { id: 'AUD003', date: '2024-06-03' }
    ];

    const tbody = document.getElementById('audit-table-body');

    data.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type="checkbox" class="rowCheckbox" data-index="${index}"></td>
        <td>${item.id}</td>
        <td>${item.date}</td>
      `;
      tbody.appendChild(row);
    });

    const selectAllCheckbox = document.getElementById('select-all-btn');

    selectAllCheckbox.addEventListener('change', function () {
      const rowCheckboxes = document.querySelectorAll('.rowCheckbox');
      rowCheckboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
    });

    document.addEventListener('change', function (e) {
      if (e.target.classList.contains('rowCheckbox')) {
        const allCheckboxes = document.querySelectorAll('.rowCheckbox');
        const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
        selectAllCheckbox.checked = allChecked;
      }
    });*/










