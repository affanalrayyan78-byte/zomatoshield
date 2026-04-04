const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zomatoshield', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Fallback to in-memory storage if MongoDB fails
    console.log('⚠️  Continuing without MongoDB - using in-memory storage');
    global.inMemoryDB = {
      users: [],
      policies: [],
      claims: []
    };
  }
};

module.exports = connectDB