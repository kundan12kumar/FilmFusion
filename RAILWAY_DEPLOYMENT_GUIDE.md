# FilmFusion Backend - Railway Deployment Guide

## Prerequisites
- NeonDB database: `postgresql://neondb_owner:npg_Po6UaMcSHr2l@ep-fancy-shadow-a1n5h65a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- Railway account
- GitHub repository with latest code

## Step 1: Create New Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your FilmFusion repository
5. Select the `server` directory as the root

## Step 2: Configure Environment Variables

In Railway dashboard, add these environment variables:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://neondb_owner:npg_Po6UaMcSHr2l@ep-fancy-shadow-a1n5h65a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your_strong_secret_key_for_filmfusion_2024
TMDB_API_KEY=d0288711dbe8df028c10d016c4aca549
TMDB_BASE_URL=https://api.themoviedb.org/3
GOOGLE_CLIENT_ID=1059821168279-l3f82nmslol1brmlr9co2l4gph4rk3oe.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
CORS_ORIGIN=http://localhost:3000,https://filmfusion-live.netlify.app
```

## Step 3: Configure Build Settings

Railway should auto-detect the Dockerfile. If not:
1. Go to Settings > Build
2. Set Build Command: `npm run build`
3. Set Start Command: `npm start`

## Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Note the new Railway domain (e.g., `https://your-new-app.up.railway.app`)

## Step 5: Update Frontend Configuration

Update Netlify environment variables:
```
REACT_APP_API_BASE_URL=https://your-new-railway-domain.up.railway.app/api
```

## Step 6: Test Deployment

1. Visit: `https://your-new-railway-domain.up.railway.app/api/health`
2. Should return: `{"status":"OK","timestamp":"...","environment":"production"}`

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correctly set
- Check NeonDB connection limits
- Review Railway logs for connection errors

### CORS Issues
- Ensure CORS_ORIGIN includes your Netlify domain
- Check Railway logs for CORS-related errors

### Build Failures
- Check Railway build logs
- Verify all dependencies are in package.json
- Ensure Dockerfile is working correctly
