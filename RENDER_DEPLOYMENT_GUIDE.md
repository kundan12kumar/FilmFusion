# FilmFusion Backend - Render Deployment Guide

## Prerequisites
- NeonDB database configured
- Render account (free tier available)
- GitHub repository with latest code

## Step 1: Create New Render Web Service

1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Select your FilmFusion repository

## Step 2: Configure Build Settings

**Basic Settings:**
- **Name**: `filmfusion-backend`
- **Region**: `Singapore` (closest to your users)
- **Branch**: `master` (or your main branch)
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

## Step 3: Configure Environment Variables

In the Render dashboard, add these environment variables:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://neondb_owner:npg_Po6UaMcSHr2l@ep-fancy-shadow-a1n5h65a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your_strong_secret_key_for_filmfusion_2024
TMDB_API_KEY=d0288711dbe8df028c10d016c4aca549
TMDB_BASE_URL=https://api.themoviedb.org/3
GOOGLE_CLIENT_ID=1059821168279-l3f82nmslol1brmlr9co2l4gph4rk3oe.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
CORS_ORIGIN=http://localhost:3000,https://filmfusion-live.netlify.app
```

## Step 4: Deploy

1. Click "Create Web Service"
2. Render will automatically start building and deploying
3. Wait for deployment to complete (usually 2-5 minutes)
4. Note your Render URL: `https://filmfusion-backend.onrender.com`

## Step 5: Update Frontend Configuration

Update your Netlify environment variables:

1. Go to Netlify dashboard
2. Site settings → Environment variables
3. Update `REACT_APP_API_BASE_URL`:
   ```
   REACT_APP_API_BASE_URL=https://filmfusion-backend.onrender.com/api
   ```
4. Redeploy your Netlify site

## Step 6: Test Deployment

1. **Health Check**: Visit `https://filmfusion-backend.onrender.com/api/health`
2. **Expected Response**: 
   ```json
   {
     "status": "OK",
     "timestamp": "2025-07-28T...",
     "environment": "production"
   }
   ```

## Step 7: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins**:
   ```
   https://filmfusion-live.netlify.app
   ```
5. Add to **Authorized redirect URIs**:
   ```
   https://filmfusion-live.netlify.app
   ```

## Render Free Tier Limitations

- **Sleep Mode**: Service sleeps after 15 minutes of inactivity
- **Cold Start**: First request after sleep takes ~30 seconds
- **Monthly Hours**: 750 hours/month (sufficient for most projects)

## Troubleshooting

### Build Failures
- Check build logs in Render dashboard
- Ensure all dependencies are in `server/package.json`
- Verify Node.js version compatibility

### Database Connection Issues
- Verify DATABASE_URL is correctly set
- Check NeonDB connection limits
- Review Render logs for connection errors

### CORS Issues
- Ensure CORS_ORIGIN includes your Netlify domain
- Check Render logs for CORS-related errors

### Service Sleep Issues
- Consider upgrading to paid plan for always-on service
- Implement a ping service to keep it awake (not recommended for production)

## Advantages of Render

1. **Easy Deployment**: Git-based deployments
2. **Free Tier**: Generous free tier for development
3. **Auto-scaling**: Automatic scaling based on traffic
4. **SSL**: Free SSL certificates
5. **Logs**: Comprehensive logging and monitoring
