# Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment Checklist

### Backend Preparation
- [x] `package.json` has `start` script
- [x] Environment variables documented in `.env.example`
- [x] CORS configured for production
- [x] MongoDB connection uses environment variable
- [x] All routes working locally
- [ ] MongoDB Atlas account created
- [ ] MongoDB connection string ready
- [ ] JWT secret key generated

### Frontend Preparation
- [x] `package.json` has `build` script
- [x] API URL uses environment variable
- [x] Build completes successfully locally (`npm run build`)
- [x] `vercel.json` configuration file created
- [ ] Test build locally: `npm run build`

### Repository Preparation
- [ ] Code committed to GitHub
- [ ] `.env` files are in `.gitignore`
- [ ] No sensitive data in code
- [ ] README updated if needed

---

## Deployment Steps

### Step 1: Deploy Backend to Render
- [ ] Create Render account
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Configure environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI=(your connection string)`
  - [ ] `JWT_SECRET=(your secret key)`
  - [ ] `FRONTEND_URL=(will update later)`
- [ ] Deploy and wait for success
- [ ] Test backend health endpoint
- [ ] Save backend URL

### Step 2: Deploy Frontend to Vercel
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Add environment variable:
  - [ ] `REACT_APP_API_URL=(your backend URL)/api`
- [ ] Deploy and wait for success
- [ ] Save frontend URL

### Step 3: Link Frontend and Backend
- [ ] Update `FRONTEND_URL` in Render with Vercel URL
- [ ] Wait for backend redeployment
- [ ] Verify CORS is working

---

## Post-Deployment Testing

### Functional Tests
- [ ] Homepage loads
- [ ] Map displays correctly
- [ ] Can view all parking locations
- [ ] User registration works
- [ ] User login works
- [ ] Can view parking slot details
- [ ] Can book a parking slot
- [ ] Booking confirmation works
- [ ] Can view "My Bookings"
- [ ] Can cancel booking
- [ ] All navigation links work

### Technical Tests
- [ ] Backend health check works
- [ ] No console errors in browser
- [ ] API calls succeed
- [ ] Authentication persists on page refresh
- [ ] Mobile responsive design works
- [ ] Dark/light theme toggle works

---

## Common Issues & Solutions

### Issue: Backend won't start on Render
**Solution:**
- Check Render logs
- Verify `start` script in `package.json`
- Ensure all environment variables are set
- Check MongoDB connection string

### Issue: Frontend can't connect to backend (CORS)
**Solution:**
- Verify `FRONTEND_URL` in backend env vars
- Check that frontend URL matches exactly (including https)
- Clear browser cache
- Check browser console for CORS errors

### Issue: Environment variables not working
**Solution:**
- Vercel: Variables must start with `REACT_APP_`
- Render: Restart service after adding variables
- Both: Rebuild after adding variables

### Issue: Build fails
**Solution:**
- Check build logs in dashboard
- Verify all dependencies in `package.json`
- Test build locally first
- Check Node version compatibility

---

## URLs to Save

After deployment, save these URLs:

- **Frontend URL**: `___________________________`
- **Backend URL**: `___________________________`
- **Backend Health Check**: `___________________________/api/health`

---

## Environment Variables Reference

### Backend (Render)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## Support

If you encounter issues:
1. Check deployment logs in Render/Vercel dashboard
2. Test endpoints directly (backend health check)
3. Check browser console for frontend errors
4. Verify environment variables are set correctly
5. Refer to full deployment guide in `DEPLOYMENT.md`


