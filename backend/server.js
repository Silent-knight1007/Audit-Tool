require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Audit = require('./models/Audit');
const NC = require('./models/NC');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('public')); // if your HTML files are in a 'public' folder


// Logging middleware (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Audit routes
app.get('/api/audits', async (req, res) => {
  try {
    const audits = await Audit.find();
    res.json(audits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*app.get('/api/audits/:id', async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id);
    if (!audit) return res.status(404).json({ message: 'Audit not found' });
    res.json(audit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});*/


app.post('/api/audits', async (req, res) => {
  try {
    const audit = new Audit(req.body);
    await audit.save();
    res.status(201).json(audit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE an audit by ID
app.delete('/api/audits/:id', async (req, res) => {
  try {
    await Audit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Audit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE an audit by ID
app.put('/api/audits/:id', async (req, res) => {
  try {
    const audit = await Audit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!audit) return res.status(404).json({ message: 'Audit not found' });
    res.json(audit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// NC routes
app.get('/api/ncs', async (req, res) => {
  try {
    const ncs = await NC.find();
    res.json(ncs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/ncs', async (req, res) => {
  try {
    const nc = new NC(req.body);
    await nc.save();
    res.status(201).json(nc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
