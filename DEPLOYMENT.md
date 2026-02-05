# Deployment Guide

This guide will help you deploy your wedding invitation website using **Vercel** (frontend) and **Render** (backend).

## Prerequisites

1. GitHub account
2. Vercel account (sign up at https://vercel.com - free)
3. Render account (sign up at https://render.com - free)

---

## Step 1: Prepare Your Repository

### Push your code to GitHub

```bash
cd /Users/eduardo/Documents/Projects/wedding_invitation

# Initialize git if not already done
git init

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Environment variables
.env
.env.local
.env.production.local

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# Database
*.db
server/db/*.db

# IDE
.vscode/
.idea/
EOF

# Add all files
git add .
git commit -m "Initial commit - wedding invitation website"

# Create GitHub repository and push
# (Follow GitHub instructions to create a new repo, then:)
git remote add origin https://github.com/YOUR_USERNAME/wedding-invitation.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

1. **Go to Render Dashboard**: https://dashboard.render.com/

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your `wedding-invitation` repository

3. **Configure the service**:
   - **Name**: `wedding-invitation-api` (or any name you prefer)
   - **Region**: Choose closest to your guests
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

4. **Add Persistent Disk** (Important for SQLite):
   - Scroll down to "Disks" section
   - Click "Add Disk"
   - **Name**: `wedding-data`
   - **Mount Path**: `/var/data`
   - **Size**: 1 GB (free tier includes 1GB)

5. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable" for each:

   ```
   NODE_ENV = production
   PORT = 3001
   ADMIN_PASSWORD = [your-secure-password]
   ADMIN_TOKEN_SECRET = [generate-random-string-here]
   DB_PATH = /var/data/wedding.db
   FRONTEND_URL = [leave empty for now, we'll update this after deploying frontend]
   ```

   > **Important**: Generate a strong random string for `ADMIN_TOKEN_SECRET`. You can use:
   > ```bash
   > node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   > ```

6. **Create Web Service**: Click "Create Web Service"

7. **Wait for Deployment**: Render will build and deploy your backend (takes 2-3 minutes)

8. **Copy Your Backend URL**: After deployment, copy the URL (e.g., `https://wedding-invitation-api.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select your `wedding-invitation` repository

3. **Configure Project**:
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `client`
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `dist` (should be auto-detected)

4. **Add Environment Variable**:
   - Click "Environment Variables"
   - Add:
     ```
     Name: VITE_API_URL
     Value: https://your-render-app.onrender.com/api
     ```
     (Replace with your actual Render backend URL from Step 2.8)

5. **Deploy**: Click "Deploy"

6. **Wait for Deployment**: Vercel will build and deploy (takes 1-2 minutes)

7. **Copy Your Frontend URL**: After deployment, copy the URL (e.g., `https://wedding-invitation-abcd123.vercel.app`)

---

## Step 4: Update Backend CORS Configuration

Now that you have your frontend URL, update the backend:

1. **Go back to Render Dashboard**
2. **Select your web service** (`wedding-invitation-api`)
3. **Go to "Environment"**
4. **Find `FRONTEND_URL`** variable
5. **Set value to your Vercel URL**: `https://your-app.vercel.app`
6. **Save Changes**

Render will automatically redeploy with the new environment variable.

---

## Step 5: Test Your Deployment

1. **Visit your Vercel URL** (your frontend)
2. **Test RSVP form**: Submit a test RSVP
3. **Check Admin Panel**: Go to `/admin` and log in with your `ADMIN_PASSWORD`
4. **Verify data persistence**: Check that your test RSVP appears in the admin panel

---

## Step 6: Update Configuration Values

Update the placeholder values in your `client/src/utils/calendar.js`:

```javascript
export const WEDDING_CONFIG = {
  brideName: 'Your Bride Name',
  groomName: 'Your Groom Name',
  weddingDateISO: '2024-09-14T16:00:00',
  // ... etc
}
```

After updating, commit and push:

```bash
git add .
git commit -m "Update wedding details"
git push
```

Both Vercel and Render will automatically redeploy with your changes.

---

## Important Notes

### Render Free Tier Limitations

- **Cold Starts**: After 15 minutes of inactivity, the backend "spins down". The first request after inactivity will take ~30 seconds to wake up.
- **Monthly Hours**: 750 hours/month (enough for a wedding site)
- **Database**: 1GB persistent disk (plenty for RSVP data)

### Vercel Free Tier Limitations

- **Bandwidth**: 100GB/month (more than enough)
- **Build Minutes**: 6000 minutes/month (plenty)
- **No cold starts**: Frontend is always fast

### Domain Configuration (Optional)

If you want to use a custom domain:

1. **Vercel**: Go to Project Settings → Domains → Add your domain
2. **Render**: Not needed (only Vercel needs custom domain for frontend)

---

## Troubleshooting

### "CORS error" in browser console

- Make sure `FRONTEND_URL` is set correctly in Render
- Make sure it matches your Vercel URL exactly (no trailing slash)
- Check that Render redeployed after adding the variable

### "Failed to fetch" errors

- Check that `VITE_API_URL` in Vercel matches your Render URL
- Make sure Render backend is running (check logs in Render dashboard)
- Wait 30 seconds if backend was sleeping (cold start)

### Admin login not working

- Verify `ADMIN_PASSWORD` is set correctly in Render
- Check browser console for error messages
- Clear browser localStorage and try again

### Database not persisting

- Make sure persistent disk is attached in Render
- Verify `DB_PATH` is set to `/var/data/wedding.db`
- Check Render logs for database errors

---

## Continuous Deployment

Both Vercel and Render are now set up for automatic deployment:

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
3. Vercel and Render will automatically detect the push and redeploy

---

## Cost

- **Vercel**: $0/month (free tier)
- **Render**: $0/month (free tier)
- **Total**: FREE! 🎉

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- Check deployment logs in each platform's dashboard
