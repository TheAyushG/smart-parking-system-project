# Quick Deployment Steps

## ⚡ Fast Track Deployment

### 1. Backend on Render (5 minutes)

1. **Push code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect GitHub repository

3. **Configure Backend Service**
   - Name: `parking-backend`
   - Root Directory: `backend` (if backend is in subdirectory)
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

4. **Set Environment Variables** in Render:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=generate-a-random-secret-key-here
   FRONTEND_URL=https://your-app.vercel.app (update after frontend deploy)
   ```

5. **Deploy** → Copy backend URL (e.g., `https://parking-backend.onrender.com`)

---

### 2. Frontend on Vercel (3 minutes)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Click "New Project"
   - Import GitHub repository

2. **Configure Frontend**
   - Framework: Create React App
   - Root Directory: `frontend` (if frontend is in subdirectory)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `build` (auto-detected)

3. **Add Environment Variable**:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.onrender.com/api`
   (Use the backend URL from step 1)

4. **Deploy** → Copy frontend URL (e.g., `https://parking-app.vercel.app`)

---

### 3. Update Backend CORS (1 minute)

1. Go back to Render dashboard
2. Edit your backend service
3. Update `FRONTEND_URL` environment variable with your Vercel URL
4. Service will auto-redeploy

---

### 4. Test (2 minutes)

1. Visit your Vercel URL
2. Test registration and login
3. Test booking a parking slot
4. Check backend health: `https://your-backend.onrender.com/api/health`

---

## 🔑 Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## ✅ Done!

Your app should now be live at your Vercel URL.


