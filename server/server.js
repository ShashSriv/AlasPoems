const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Poem = require('./models/Poem');

// Try to load from root .env if running from server dir, or current dir if running from root
// For simplicity, we assume the .env is in the project root
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('Error: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Middleware for Admin Check
const isAdmin = (req, res, next) => {
  const adminHeader = req.headers['x-admin']; 
  // Check for the specific header value "true" (string)
  if (adminHeader === 'true') {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized: Admin access required' });
  }
};

// Routes

// GET /api/poems - Read all
app.get('/api/poems', async (req, res) => {
  try {
    const poems = await Poem.find().sort({ date: -1 });
    res.json(poems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/poems - Create
app.post('/api/poems', async (req, res) => {
  const poem = new Poem({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    date: req.body.date || Date.now(),
    likes: req.body.likes || 0
  });

  try {
    const newPoem = await poem.save();
    res.status(201).json(newPoem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/poems/:id - Update (Admin only)
app.put('/api/poems/:id', isAdmin, async (req, res) => {
  try {
    const updatedPoem = await Poem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPoem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/poems/:id - Delete (Admin only)
app.delete('/api/poems/:id', isAdmin, async (req, res) => {
  try {
    await Poem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Poem deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
