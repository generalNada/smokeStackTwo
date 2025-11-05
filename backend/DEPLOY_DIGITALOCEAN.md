# Deploying Backend to DigitalOcean App Platform

## Quick Answer: Can you do this without server.js?

**NO** ❌ - You MUST deploy server.js (or equivalent server code) to DigitalOcean. Here's why and how:

## Why server.js is Required

Your `server.js` file is the **backend application** that:

- Creates HTTP API endpoints (`/api/strains`, `/api/auth`, etc.)
- Handles authentication (login, registration, sessions)
- Connects to databases
- Processes requests and returns responses
- Manages security (CORS, validation, etc.)

**Without server.js, there is no API. Period.**

## What DigitalOcean Already Has

The existing endpoint `https://franky-app-ix96j.ondigitalocean.app/api` is already running server.js (or similar Node.js code) somewhere. To add features like authentication, you need to:

1. **Deploy your new server.js** to DigitalOcean App Platform
2. **OR** update the existing server.js code on DigitalOcean

## Deployment Options

### Option 1: Deploy to DigitalOcean App Platform (Recommended)

#### Step 1: Create a New App or Update Existing

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click **"Create App"** or select the existing app (`franky-app-ix96j`)

#### Step 2: Connect Repository

- Connect your GitHub repository
- Select the `backend/` folder as the root directory
- OR deploy the entire repo and set the root to `backend/`

#### Step 3: Configure Build Settings

**Build Command:**

```bash
npm install
```

**Run Command:**

```bash
npm start
```

#### Step 4: Set Environment Variables

In DigitalOcean App Platform settings, add these environment variables:

```env
PORT=8080
NODE_ENV=production
DB_PATH=/app/data/strains.db
CORS_ORIGIN=https://yourusername.github.io,https://franky-app-ix96j.ondigitalocean.app
```

**Note:** DigitalOcean App Platform may auto-assign a PORT. Check your app's settings.

#### Step 5: Database Configuration

**Option A: Use SQLite (Simple, for small apps)**

- SQLite file will be stored in the app's filesystem
- May be lost on app restart (use managed database for production)

**Option B: Use DigitalOcean Managed Database (Recommended for production)**

1. Create a PostgreSQL or MySQL database in DigitalOcean
2. Update `backend/db.js` to use the database connection string
3. Install database driver: `npm install pg` or `npm install mysql2`

#### Step 6: Deploy

Click **"Deploy"** and wait for the build to complete.

#### Step 7: Get Your API URL

After deployment, DigitalOcean will provide a URL like:

- `https://your-app-name.ondigitalocean.app`

Your API will be available at:

- `https://your-app-name.ondigitalocean.app/api/strains`

#### Step 8: Update Frontend

Update `script.js` to use the new URL:

```javascript
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api"
    : "https://your-app-name.ondigitalocean.app/api";
```

### Option 2: Deploy to DigitalOcean Droplet (More Control)

If you need more control, you can deploy to a Droplet:

1. **Create a Droplet** (Ubuntu 22.04 recommended)
2. **SSH into the Droplet**
3. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. **Clone your repository:**
   ```bash
   git clone <your-repo-url>
   cd smokeStackTwo/backend
   ```
5. **Install dependencies:**
   ```bash
   npm install
   ```
6. **Create `.env` file:**
   ```bash
   nano .env
   ```
   Add:
   ```env
   PORT=3000
   NODE_ENV=production
   DB_PATH=./data/strains.db
   CORS_ORIGIN=*
   ```
7. **Use PM2 to keep server running:**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name smokestack-api
   pm2 save
   pm2 startup
   ```
8. **Set up Nginx as reverse proxy** (optional, for HTTPS):
   ```bash
   sudo apt install nginx
   ```
   Configure Nginx to proxy requests to `http://localhost:3000`

### Option 3: Update Existing DigitalOcean App

If the existing `franky-app-ix96j` app is already running Node.js code:

1. **Find the existing code** on DigitalOcean
2. **Update it** with your new `server.js` and routes
3. **Redeploy** the app

## Alternatives (Still Require Server Code)

### Firebase / Supabase (Database-as-a-Service)

These services provide APIs, but they're still running server code on their infrastructure:

- **Firebase:** Provides REST APIs, but you still need to write server-side security rules
- **Supabase:** Provides auto-generated APIs, but you still need to write server-side functions for complex logic

**For authentication and custom features, you still need server code.**

## What About Authentication?

Authentication **requires** server.js because:

1. **Registration/Login:** Need endpoints (`POST /api/auth/register`, `POST /api/auth/login`)
2. **Password Hashing:** Must happen on the server (never trust client-side)
3. **Session Management:** Server must create and validate JWT tokens
4. **Protected Routes:** Server must check authentication before allowing access

**You cannot implement secure authentication without server code.**

## Summary

| Question                                      | Answer                                   |
| --------------------------------------------- | ---------------------------------------- |
| Can you serve backend without server.js?      | **NO** ❌                                |
| Can you add authentication without server.js? | **NO** ❌                                |
| Can DigitalOcean auto-create APIs?            | **NO** ❌                                |
| Do Firebase/Supabase eliminate server code?   | **NO** ❌ (they run server code for you) |

## Next Steps

1. **Deploy server.js to DigitalOcean App Platform** (Option 1 above)
2. **Set up environment variables**
3. **Configure database** (SQLite for now, managed DB for production)
4. **Test the API** using the health check endpoint
5. **Update frontend** to use the new API URL
6. **Add authentication** features to server.js

## Need Help?

If your sister needs help deploying, she can:

1. Follow Option 1 (DigitalOcean App Platform) - it's the easiest
2. Use DigitalOcean's documentation: https://docs.digitalocean.com/products/app-platform/
3. Check the app logs in DigitalOcean dashboard if something goes wrong
