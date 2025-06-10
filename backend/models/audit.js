const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  auditId: { type: String, required: true, unique: true }, // unique audit identifier
  auditType: { type: String, required: true },
  standards: { type: String, required: true },
  leadAuditor: { type: String, required: true },
  location: { type: String, required: true },
  auditTeam: { type: String, required: true },
  plannedDate: { type: Date, required: true },
  status: { type: String, default: 'pending' }, // default status
  actualDate: { type: Date },
}, { timestamps: true }); // adds createdAt, updatedAt fields automatically

module.exports = mongoose.model('Audit', auditSchema);
