const fs = require('fs');
const mongoose = require('mongoose');

console.log("Parsing env variables...");
const envContent = fs.readFileSync('/Users/tariqmahmood/Projects/live-papers/.env.local', 'utf8');
const mongoUriLine = envContent.split('\n').find(line => line.startsWith('MONGODB_URI='));
const mongoUri = mongoUriLine ? mongoUriLine.substring(12).trim() : null;

if (!mongoUri) {
  console.error("Could not find MONGODB_URI in .env.local");
  process.exit(1);
}

console.log("Connecting to MongoDB...");
mongoose.connect(mongoUri)
  .then(async () => {
    console.log("Connected to MongoDB database.");
    const db = mongoose.connection.db;
    
    // Clear users collection directly using native driver
    const result = await db.collection('users').deleteMany({});
    console.log(`Cleared 'users' collection successfully. Deleted ${result.deletedCount} documents.`);
    
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error clearing database:", err);
    process.exit(1);
  });

