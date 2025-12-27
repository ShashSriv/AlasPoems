const mongoose = require('mongoose');

const PoemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
  likes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Poem', PoemSchema);