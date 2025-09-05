#!/usr/bin/env node

/**
 * Build script for Render deployment
 * This script runs before the server starts to ensure everything is set up correctly
 */

const { initializeDatabase } = require('./database/connection');

async function build() {
  console.log('🔄 Starting FilmFusion build process...');
  
  try {
    // Check environment variables
    console.log('📊 Checking environment variables...');
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'TMDB_API_KEY',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:', missingVars);
      process.exit(1);
    }
    
    console.log('✅ All required environment variables are set');
    
    // Initialize database
    console.log('🔄 Initializing database schema...');
    await initializeDatabase();
    console.log('✅ Database schema initialized successfully');
    
    console.log('🎉 Build process completed successfully!');
    
  } catch (error) {
    console.error('❌ Build process failed:', error.message);
    process.exit(1);
  }
}

// Run build if this script is executed directly
if (require.main === module) {
  build();
}

module.exports = { build };
