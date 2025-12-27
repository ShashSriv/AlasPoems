const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Poem = require('./models/Poem');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const samplePoems = [
  {
    title: "The Digital Quill",
    content: "Lines of code,\nLike stanzas in the dark,\nWaiting for a spark\nTo turn the logic into gold.\n\nA breath of air,\nA binary prayer.",
    category: "Modern",
    likes: 5
  },
  {
    title: "Morning Mist",
    content: "The fog clings to the river bank\nSilent and cold.\nThe world is a blank page\nWaiting for the sun to write in yellow.",
    category: "Nature",
    likes: 12
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");
    
    // Clear existing poems so we don't double up
    await Poem.deleteMany({});
    
    // Insert the samples
    await Poem.insertMany(samplePoems);
    console.log("Success: 2 poems inserted!");
    
    process.exit();
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDB();