# Deployment Guide

This guide covers deploying Next Event to production.

## Architecture Overview

\`\`\`
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Vercel    │─────▶│   Render    │─────▶│   MongoDB   │
│  (Frontend) │      │  (Backend)  │      │    Atlas    │
└─────────────┘      └─────────────┘      └─────────────┘
\`\`\`

## Step 1: MongoDB Atlas Setup

1. **Create Production Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (M0 free tier works for testing)
   - Name it `next-event-prod`

2. **Configure Network Access**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - Or add specific IPs of your backend server

3. **Create Database User**
   - Go to Database Access
   - Add new database user
   - Username: `nextevent`
   - Password: Generate secure password
   - Role: Read and write to any database

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your user password
   - Replace `<dbname>` with `next-event`

## Step 2: Backend Deployment (Render)

1. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `next-event-api`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `node server/index.js`
     - Instance Type: Free

3. **Add Environment Variables**
   \`\`\`
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-random-secure-string>
   NODE_ENV=production
   PORT=3001
   \`\`\`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://next-event-api.onrender.com`

## Step 3: Frontend Deployment (Vercel)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   \`\`\`

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Project**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables**
   \`\`\`
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<same-as-backend>
   NEXT_PUBLIC_API_URL=https://next-event-api.onrender.com/api
   \`\`\`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

## Step 4: Seed Production Database

1. **Update Seed Script**
   - Temporarily update `server/scripts/seed.ts` with production MongoDB URI
   - Or use environment variable

2. **Run Seed**
   \`\`\`bash
   MONGODB_URI=<production-uri> npm run seed
   \`\`\`

3. **Verify**
   - Login to your production app
   - Use admin credentials: `admin@nextevent.com` / `admin123`

## Step 5: Configure CORS

Update `server/index.ts`:

\`\`\`typescript
app.use(cors({
  origin: [
    'https://your-project.vercel.app',
    'http://localhost:3000' // for local development
  ],
  credentials: true
}))
\`\`\`

## Step 6: Update Backend URL

If your backend URL changes, update:

1. **Vercel Environment Variables**
   - Go to Project Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL`
   - Redeploy

2. **Local Development**
   - Update `.env` file
   - Restart dev server

## Alternative Deployment Options

### Backend Alternatives

**Railway:**
\`\`\`bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables
railway variables set MONGODB_URI=<uri>
railway variables set JWT_SECRET=<secret>

# Deploy
railway up
\`\`\`

**DigitalOcean App Platform:**
1. Create new app
2. Connect GitHub
3. Configure build settings
4. Add environment variables
5. Deploy

### Frontend Alternatives

**Netlify:**
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables
5. Deploy

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] Network access configured
- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Database seeded with initial data
- [ ] Test authentication flow
- [ ] Test event creation (admin)
- [ ] Test event registration (student)
- [ ] Verify maps are working
- [ ] Check mobile responsiveness
- [ ] Test all API endpoints
- [ ] Monitor error logs

## Monitoring & Maintenance

### Render
- View logs: Dashboard → Your Service → Logs
- Monitor metrics: Dashboard → Metrics
- Set up alerts for downtime

### Vercel
- View deployments: Project → Deployments
- Check analytics: Project → Analytics
- Monitor performance: Project → Speed Insights

### MongoDB Atlas
- Monitor cluster: Cluster → Metrics
- View slow queries: Performance Advisor
- Set up alerts: Alerts

## Troubleshooting

### Backend not connecting to MongoDB
- Check MongoDB Atlas network access
- Verify connection string format
- Check database user permissions

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS configuration
- Ensure backend is running

### Authentication not working
- Verify `JWT_SECRET` matches on both frontend and backend
- Check cookie settings (secure, sameSite)
- Ensure credentials are included in requests

### Maps not loading
- Check Leaflet CSS is imported
- Verify latitude/longitude values
- Check browser console for errors

## Security Best Practices

1. **Use Strong Secrets**
   - Generate random JWT_SECRET: `openssl rand -base64 32`
   - Never commit secrets to Git

2. **Enable HTTPS**
   - Vercel and Render provide HTTPS by default
   - Ensure secure cookies in production

3. **Rate Limiting**
   - Already configured in Express
   - Monitor for abuse

4. **Input Validation**
   - express-validator is configured
   - Sanitize user inputs

5. **Database Security**
   - Use strong database passwords
   - Limit network access
   - Enable MongoDB authentication

## Cost Estimation

### Free Tier (Development/Testing)
- MongoDB Atlas: M0 Free (512MB)
- Render: Free tier (750 hours/month)
- Vercel: Free tier (100GB bandwidth)
- **Total: $0/month**

### Production (Small Scale)
- MongoDB Atlas: M10 Shared ($9/month)
- Render: Starter ($7/month)
- Vercel: Pro ($20/month)
- **Total: ~$36/month**

### Production (Medium Scale)
- MongoDB Atlas: M30 Dedicated ($60/month)
- Render: Standard ($25/month)
- Vercel: Pro ($20/month)
- **Total: ~$105/month**

## Support

For deployment issues:
- Render: [Render Docs](https://render.com/docs)
- Vercel: [Vercel Docs](https://vercel.com/docs)
- MongoDB: [MongoDB Docs](https://docs.mongodb.com)
