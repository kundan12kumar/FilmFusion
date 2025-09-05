# FilmFusion Deployment Guide

## 🚀 Production Deployment

### Backend Deployment (Railway)

1. **Create Railway Account**: Sign up at [railway.app](https://railway.app)

2. **Deploy Backend**:
   - Connect your GitHub repository
   - Select the `server` folder as the root directory
   - Railway will automatically detect Node.js and deploy

3. **Environment Variables** (Set in Railway Dashboard):
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<Railway will provide this>
   JWT_SECRET=your_strong_secret_key_for_filmfusion_2024
   TMDB_API_KEY=d0288711dbe8df028c10d016c4aca549
   TMDB_BASE_URL=https://api.themoviedb.org/3
   GOOGLE_CLIENT_ID=1059821168279-l3f82nmslol1brmlr9co2l4gph4rk3oe.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=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
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   REDIS_URL=<Optional: Add Redis if needed>
   ```

4. **Database Setup**:
   - Railway will automatically provision PostgreSQL
   - Database schema will be initialized on first run

### Frontend Deployment (Netlify)

1. **Create Netlify Account**: Sign up at [netlify.com](https://netlify.com)

2. **Deploy Frontend**:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Netlify will auto-detect React and deploy

3. **Environment Variables** (Set in Netlify Dashboard):
   ```
   REACT_APP_API_BASE_URL=https://artistic-sparkle-production.up.railway.app/api
   REACT_APP_GOOGLE_CLIENT_ID=1059821168279-l3f82nmslol1brmlr9co2l4gph4rk3oe.apps.googleusercontent.com
   REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
   GENERATE_SOURCEMAP=false
   ```

4. **Netlify Configuration**:
   - The `netlify.toml` file is already configured for optimal deployment
   - Includes SPA routing redirects and security headers

### Post-Deployment Configuration

1. **Update CORS Origins**:
   - Add your Netlify domain to Railway's CORS_ORIGIN environment variable
   - Example: `https://your-app-name.netlify.app`

2. **Update Google OAuth**:
   - Add your Netlify domain to Google OAuth authorized origins
   - Add your Netlify domain to authorized redirect URIs

3. **Test Deployment**:
   - Verify health check: `https://your-railway-app.railway.app/api/health`
   - Test authentication and cookie functionality

## 🔧 Required Credentials

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins and redirect URIs

### TMDB API Setup
1. Sign up at [TMDB](https://www.themoviedb.org/)
2. Go to Settings > API
3. Request API key
4. Use the API key in environment variables

## 🍪 Cookie Configuration

Cookies are automatically configured for production:
- **Secure**: Enabled in production
- **SameSite**: Set to 'strict' in production
- **HttpOnly**: Authentication cookies are HTTP-only
- **Domain**: Automatically configured for your domain

## 📦 Cache Configuration

Cache system works in production:
- **Redis**: Optional, falls back to in-memory cache
- **TTL**: Optimized for production performance
- **Error Handling**: Graceful degradation

## 🔒 Security Features

- HTTP-only cookies for authentication
- CORS protection
- Environment-based security flags
- XSS and CSRF protection headers
- Secure cookie settings in production

## 📊 Monitoring

- Health check endpoint: `/api/health`
- Database connection monitoring
- Cache performance logging
- Error tracking and logging
