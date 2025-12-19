const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Missing MONGO_URI in environment');
    process.exit(1);
  }
  
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // Get actual connected database name from mongoose connection
    const connectedDbName = mongoose.connection.db.databaseName;
    const connectedHost = mongoose.connection.host;
    
    console.log(`MongoDB connected to DB: ${connectedDbName}`);
    console.log(`MongoDB connected to host: ${connectedHost}`);
    
    // Abort if database name is NOT "galleryDB"
    if (connectedDbName !== 'galleryDB') {
      console.error(`ERROR: Connected to wrong database: ${connectedDbName}`);
      console.error('Expected database: galleryDB');
      console.error('Please update MONGO_URI to include /galleryDB');
      process.exit(1);
    }
  } catch (err) {
    console.error('Mongo connection error', err);
    process.exit(1);
  }
};

module.exports = { connectDB };


