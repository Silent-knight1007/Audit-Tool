// routes/auditRoutes.js
const express = require('express');
const router = express.Router();
const Audit = require('../models/Audit');

// Create a new audit
router.post('/audits', async (req, res) => {
  try {
    const audit = new Audit(req.body);
    await audit.save();
    res.status(201).json(audit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all audits
router.get('/audits', async (req, res) => {
  try {
    const audits = await Audit.find();
    res.json(audits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get audit by id
router.get('/audits/:id', async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id);
    if (!audit) return res.status(404).json({ message: 'Audit not found' });
    res.json(audit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update audit by id
router.put('/audits/:id', async (req, res) => {
  try {
    const updatedAudit = await Audit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAudit) return res.status(404).json({ message: 'Audit not found' });
    res.json(updatedAudit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete audit by id
router.delete('/audits/:id', async (req, res) => {
  try {
    const deletedAudit = await Audit.findByIdAndDelete(req.params.id);
    if (!deletedAudit) return res.status(404).json({ message: 'Audit not found' });
    res.json({ message: 'Audit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
