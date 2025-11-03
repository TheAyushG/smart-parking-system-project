# Deployment Guide

This guide will help you deploy your Smart Parking Management System to production.

## Prerequisites
- GitHub account
- Vercel account (free tier works)
- Render account (free tier works)
- MongoDB Atlas account (free tier works)

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Backend Repository
1. Make sure your backend code is in a GitHub repository
2. Note: Render requires the backend to be in a separate repository or a subdirectory

### Step 2: Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub account if not already connected
4. Select your repository
5. Configure the service:
   - **Name**: `parking-backend` (or your preferred name)
   - **Region**: Choose closest to you
   - **Branch**: `main` or `master`
   - **Root Directory**: `backend` (if backend is in a subdirectory) or leave blank if backend is root
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Configure Environment Variables on Render
In the Render dashboard, go to Environment section and add:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your-very-secure-random-secret-key-here
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Important Notes:**
- Render will automatically set `PORT`, but you can set it explicitly
- For `MONGODB_URI`: Use your MongoDB Atlas connection string
- For `JWT_SECRET`: Generate a strong random string (e.g., use `openssl rand -hex 32`)
- For `FRONTEND_URL`: Update this after you deploy frontend (step 5)

### Step 4: Deploy Backend
1. Click "Create Web Service"
2. Render will automatically build and deploy your backend
3. Wait for deployment to complete (usually 2-5 minutes)
4. Note your backend URL (e.g., `https://parking-backend.onrender.com`)

---

## Part 2: Deploy Frontend to Vercel

### Step 5: Update Frontend Environment Variable
1. In your frontend folder, create `.env.production` file:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
   Replace `your-backend-url.onrender.com` with your actual Render backend URL

### Step 6: Create Vercel Account
1. Go to [Vercel](https://vercel.com/)
2. Sign up/Login with GitHub

### Step 7: Deploy Frontend to Vercel
1. Click "New Project" in Vercel dashboard
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend` (if frontend is in subdirectory) or leave blank
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. Add Environment Variable:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   (Replace with your actual Render backend URL)

5. Click "Deploy"
6. Wait for deployment (usually 1-3 minutes)
7. Note your frontend URL (e.g., `https://parking-app.vercel.app`)

### Step 8: Update Backend CORS with Frontend URL
1. Go back to Render dashboard
2. Edit your backend service
3. Update the `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
4. Redeploy the backend (Render auto-redeploys on env var changes)

---

## Part 3: MongoDB Atlas Setup (if not already done)

### Step 9: Setup MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user:
   - Username: (your choice)
   - Password: (generate a strong password)
4. Whitelist IP addresses:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for Render)
   - Or add Render's IP ranges if you prefer
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/parkingsystem?retryWrites=true&w=majority`

---

## Part 4: Testing Your Deployment

### Step 10: Test Your Deployed App
1. Visit your Vercel frontend URL
2. Test the following:
   - [ ] Frontend loads correctly
   - [ ] Can register a new user
   - [ ] Can login
   - [ ] Can view parking locations
   - [ ] Can book a parking slot
   - [ ] Map displays correctly

### Step 11: Verify Backend Health
1. Visit: `https://your-backend-url.onrender.com/api/health`
2. You should see: `{"status":"Server is running","timestamp":"..."}`

---

## Troubleshooting

### Common Issues:

1. **Backend shows "Service Unavailable"**
   - Check Render logs for errors
   - Verify environment variables are set correctly
   - Ensure MongoDB connection string is valid

2. **Frontend can't connect to backend (CORS errors)**
   - Verify `FRONTEND_URL` in backend env vars matches your Vercel URL exactly
   - Check browser console for CORS errors
   - Ensure backend CORS configuration allows your frontend URL

3. **Environment variables not working**
   - Vercel: Make sure variable name starts with `REACT_APP_`
   - Render: Restart the service after adding env vars
   - Both: Clear browser cache and hard refresh

4. **MongoDB connection errors**
   - Verify connection string is correct
   - Check IP whitelist in MongoDB Atlas
   - Ensure password is URL-encoded (special characters)

5. **Build fails on Vercel**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node version compatibility

---

## Quick Reference

### Backend (Render)
- **URL**: `https://your-backend.onrender.com`
- **Health Check**: `https://your-backend.onrender.com/api/health`
- **Environment Variables Required**:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `FRONTEND_URL`
  - `NODE_ENV=production`

### Frontend (Vercel)
- **URL**: `https://your-app.vercel.app`
- **Environment Variables Required**:
  - `REACT_APP_API_URL`

---

## Notes

- Render free tier services spin down after 15 minutes of inactivity (first request may be slow)
- Vercel has excellent performance with global CDN
- Both platforms support automatic deployments from GitHub
- Consider upgrading to paid plans for production use

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] MongoDB Atlas configured and connected
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Test user registration and login
- [ ] Test booking functionality
- [ ] Map displays correctly
- [ ] All pages accessible
- [ ] Mobile responsiveness verified

---

**Your app is now live! 🎉**


