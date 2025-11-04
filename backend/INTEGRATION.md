# Backend Integration Guide

## Your Questions Answered

### 1. Can I keep backend code in the same repo without breaking GitHub Pages?

**Yes!** ✅ The backend folder is completely separate from your frontend files. GitHub Pages only serves static files (HTML, CSS, JS), so it will ignore:

- The `backend/` folder
- `package.json` files
- Node.js code

Your GitHub Pages deployment will continue to work exactly as before.

### 2. Is it safe to do this without breaking the deployed frontend?

**Absolutely!** ✅ Your frontend code doesn't need to change. It already has:

- API-first architecture with fallbacks
- Support for switching API endpoints
- LocalStorage fallback

The frontend will continue to work with:

- The existing DigitalOcean API (when deployed)
- Your local backend (when testing locally)
- LocalStorage (as a fallback)

### 3. How do I use the backend locally vs. deployed?

## Local Development Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Create `.env` File

Create `backend/.env`:

```env
PORT=3000
NODE_ENV=development
DB_PATH=./data/strains.db
CORS_ORIGIN=http://localhost:8000,http://127.0.0.1:8000
```

### Step 3: Seed the Database (Optional)

Import your existing `strains.json` data:

```bash
npm run seed
```

This will populate the SQLite database with data from `../strains.json`.

### Step 4: Start the Backend Server

```bash
npm run dev
```

The server will run on `http://localhost:3000`.

### Step 5: Point Frontend to Local Backend

Temporarily update `script.js` for local testing:

```javascript
// For local development
const API_BASE = "http://localhost:3000/api";

// For production (keep this commented during local dev)
// const API_BASE = "https://franky-app-ix96j.ondigitalocean.app/api";
```

### Step 6: Start Frontend

In another terminal:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` - your frontend will now use the local backend!

### Step 7: Revert Frontend for GitHub Pages

Before committing/pushing, revert `script.js` back to the DigitalOcean API:

```javascript
const API_BASE = "https://franky-app-ix96j.ondigitalocean.app/api";
```

## Better Approach: Environment-Based API URL

You could make the frontend automatically detect the environment:

```javascript
// Auto-detect API based on hostname
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api"
    : "https://franky-app-ix96j.ondigitalocean.app/api";
```

This way, the frontend automatically uses local backend when testing locally, and the production API when deployed.

## Production Deployment

### Option 1: Deploy Backend Separately (Recommended)

Deploy the backend to Render/Railway/DigitalOcean:

1. **Create a new service** on your platform
2. **Point it to your repo** (or just the `backend/` folder if possible)
3. **Set environment variables:**
   ```
   PORT=3000
   NODE_ENV=production
   DB_PATH=./data/strains.db
   CORS_ORIGIN=https://yourusername.github.io
   ```
4. **Get your backend URL** (e.g., `https://smokestack-api.onrender.com`)
5. **Update `script.js`:**
   ```javascript
   const API_BASE = "https://smokestack-api.onrender.com/api";
   ```

### Option 2: Keep Using DigitalOcean API

No changes needed! Your frontend already uses it.

## Testing the Backend

### Health Check

```bash
curl http://localhost:3000/health
```

### Get All Strains

```bash
curl http://localhost:3000/api/strains
```

### Create a Strain

```bash
curl -X POST http://localhost:3000/api/strains \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Strain",
    "type": "Hybrid",
    "source": "Test Source"
  }'
```

## Project Structure

```
smokeStackTwo/
├── backend/              # NEW: Backend code (not deployed to Pages)
│   ├── server.js
│   ├── db.js
│   ├── seed.js
│   ├── routes/
│   ├── controllers/
│   ├── data/            # SQLite DB (gitignored)
│   └── .env            # Environment vars (gitignored)
├── index.html           # Frontend (deployed to Pages)
├── script.js            # Frontend (deployed to Pages)
├── style.css            # Frontend (deployed to Pages)
└── strains.json         # Frontend (deployed to Pages)
```

## Important Notes

1. **`.gitignore` is configured** to exclude:

   - `backend/node_modules/`
   - `backend/.env`
   - `backend/data/*.db` (database files)

2. **Database files are gitignored** - each environment will have its own database

3. **Environment variables** keep sensitive config out of code

4. **CORS is configured** to allow your frontend domain

5. **Frontend doesn't need changes** - it already supports API switching

## Next Steps

- ✅ Backend is scaffolded and ready
- ✅ Database schema matches your data structure
- ✅ All CRUD operations implemented
- ✅ Frontend integration is seamless
- 🔄 Deploy backend to production when ready
- 🔄 Optionally add authentication/authorization
- 🔄 Optionally migrate to PostgreSQL for production
