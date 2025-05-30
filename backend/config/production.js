module.exports = {
  // Production environment settings
  env: 'production',
  
  // Security settings
  cors: {
    origin: process.env.FRONTEND_URL || 'https://your-domain.com',
    credentials: true
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  
  // MongoDB connection options
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 5
  },
  
  // JWT settings
  jwt: {
    expiresIn: '24h',
    refreshExpiresIn: '7d'
  },
  
  // Logging settings
  logging: {
    level: 'error',
    format: 'json'
  }
}; 