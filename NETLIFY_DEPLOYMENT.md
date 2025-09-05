# FilmFusion - Netlify Deployment Guide

This guide will help you deploy the FilmFusion frontend to Netlify instead of Vercel.

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to GitHub
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **Railway Backend**: Your backend should already be deployed on Railway

## Step-by-Step Deployment

### 1. Connect Repository to Netlify

1. Log in to your Netlify dashboard
2. Click "New site from Git"
3. Choose "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select your FilmFusion repository

### 2. Configure Build Settings

In the deployment configuration:

- **Base directory**: Leave empty (root directory)
- **Build command**: `npm run build`
- **Publish directory**: `build`
- **Production branch**: `main` (or your default branch)

### 3. Set Environment Variables

In your Netlify site dashboard, go to **Site settings > Environment variables** and add:

```
REACT_APP_API_BASE_URL=https://artistic-sparkle-production.up.railway.app/api
REACT_APP_GOOGLE_CLIENT_ID=1059821168279-l3f82nmslol1brmlr9co2l4gph4rk3oe.apps.googleusercontent.com
REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
GENERATE_SOURCEMAP=false
```

### 4. Deploy

1. Click "Deploy site"
2. Netlify will automatically build and deploy your site
3. You'll get a random subdomain like `https://amazing-name-123456.netlify.app`

### 5. Custom Domain (Optional)

1. In Site settings > Domain management
2. Add your custom domain
3. Configure DNS settings as instructed by Netlify

## Post-Deployment Configuration

### 1. Update Backend CORS Settings

Update your Railway backend environment variables:

1. Go to your Railway project dashboard
2. Navigate to your backend service
3. Update the `CORS_ORIGIN` environment variable to include your Netlify domain:

```
CORS_ORIGIN=http://localhost:3000,https://your-netlify-app.netlify.app
```

### 2. Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID
4. Add your Netlify domain to:
   - **Authorized JavaScript origins**: `https://your-netlify-app.netlify.app`
   - **Authorized redirect URIs**: `https://your-netlify-app.netlify.app`

### 3. Test Your Deployment

1. Visit your Netlify URL
2. Test user registration and login
3. Verify movie search and rating functionality
4. Check that all API calls work correctly

## Netlify Configuration Features

The `netlify.toml` file includes:

- **SPA Routing**: Redirects all routes to `index.html` for React Router
- **Security Headers**: X-Frame-Options, XSS Protection, etc.
- **Caching**: Optimized caching for static assets
- **Build Optimization**: Source maps disabled for production

## Troubleshooting

### Build Failures

1. Check build logs in Netlify dashboard
2. Ensure all dependencies are in `package.json`
3. Verify environment variables are set correctly

### API Connection Issues

1. Check that `REACT_APP_API_BASE_URL` points to your Railway backend
2. Verify CORS settings on the backend
3. Check browser network tab for failed requests

### Authentication Issues

1. Verify Google OAuth settings include Netlify domain
2. Check that cookies are working across domains
3. Ensure JWT tokens are being sent correctly

## Advantages of Netlify over Vercel

1. **Better React Support**: Optimized for React applications
2. **Easier Configuration**: Simple build settings
3. **Better Performance**: Global CDN with edge locations
4. **Form Handling**: Built-in form processing (if needed later)
5. **Split Testing**: A/B testing capabilities
6. **Better Analytics**: Detailed performance metrics

## Continuous Deployment

Once connected, Netlify will automatically:

1. Deploy when you push to your main branch
2. Create preview deployments for pull requests
3. Run build checks before deployment
4. Provide deployment notifications

Your FilmFusion app is now successfully deployed on Netlify! 🎉
