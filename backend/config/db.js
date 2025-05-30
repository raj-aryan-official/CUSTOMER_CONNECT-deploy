const mongoose = require('mongoose');
const productionConfig = require('./production');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      ...productionConfig.mongoOptions,
      ...(process.env.NODE_ENV === 'development' ? {
        useNewUrlParser: true,
        useUnifiedTopology: true
      } : {})
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('Database name:', conn.connection.name);
    
    // Log when the connection is lost
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Log when the connection is reconnected
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 