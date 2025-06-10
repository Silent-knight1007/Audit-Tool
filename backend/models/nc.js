const mongoose = require('mongoose');

const ncSchema = new mongoose.Schema({
  ncId: String,
  auditId: String,
  description: String,
  clause: String,
  type: String,
  dueDate: String,
  department: String,
  responsiblePerson: String,
  responsiblePersonEmail: String,
  location: String,
  correctiveAction: String,
  preventiveAction: String,
  rootCause: String,
  status: String
});

module.exports = mongoose.model('NC', ncSchema);
