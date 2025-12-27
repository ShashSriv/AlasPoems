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
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
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

// POST /api/login - Admin Login
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

// GET /api/poems - Read all
app.get('/api/poems', async (req, res) => {
  try {
    const poems = await Poem.find().sort({ date: -1 });
    res.json(poems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/poems/:id - Read one
app.get('/api/poems/:id', async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id);
    if (!poem) return res.status(404).json({ message: 'Poem not found' });
    res.json(poem);
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

// POST /api/poems/:id/like - Like/Unlike (Public)
app.post('/api/poems/:id/like', async (req, res) => {
  const { action } = req.body;
  if (action !== 'inc' && action !== 'dec') {
    return res.status(400).json({ message: "Invalid action. Use 'inc' or 'dec'." });
  }

  try {
    const increment = action === 'inc' ? 1 : -1;
    const updatedPoem = await Poem.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: increment } },
      { new: true }
    );
    
    if (!updatedPoem) {
        return res.status(404).json({ message: 'Poem not found' });
    }
    
    res.json(updatedPoem);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
