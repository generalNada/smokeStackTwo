# GitHub Pages Deployment Guide

## ✅ Yes, SmokeStack Works on GitHub Pages!

SmokeStack is a **static site** that works perfectly on GitHub Pages.

## Why It Works

Your app uses:

- ✅ **Static HTML/CSS/JS** - No server-side code
- ✅ **Browser Fetch API** - Loads `strains.json` via HTTP
- ✅ **LocalStorage** - Client-side data persistence
- ✅ **External images** - URLs from CDNs (Unsplash, Cloudinary, etc.)

All of these are supported on GitHub Pages!

## Quick Start

### 1. Initialize Git (if not done)

```bash
cd smokeStackTwo
git init
git add .
git commit -m "Add SmokeStack app"
```

### 2. Push to GitHub

```bash
# Replace with your GitHub username and repo name
git remote add origin https://github.com/YOUR_USERNAME/smokeStack.git
git branch -M main
git push -u origin main
```

### 3. Enable Pages

1. On GitHub, go to your repo
2. Click **Settings** → **Pages**
3. Source: `Deploy from a branch`
4. Branch: `main` / `/(root)`
5. Click **Save**

### 4. Access Your Site

```
https://YOUR_USERNAME.github.io/smokeStack/
```

Wait 1-2 minutes for the deployment to complete.

## Important Points

### ✅ What Works

- All app functionality (add, edit, search)
- LocalStorage persistence per user
- External images (Unsplash, Cloudinary)
- Responsive mobile design
- Offline mode after first load

### ⚠️ Limitations

**No Cross-Device Sync:**

- Each device/browser has its own data
- LocalStorage is device-specific
- No cloud backup

**No Image Upload:**

- Can't upload images directly
- Must use external image URLs
- Cloudinary is recommended for production

### 🔄 For Production Use

Consider these enhancements:

1. **Backend Database** (Firebase, Supabase)

   - Store strains in a database
   - Sync across devices
   - User accounts

2. **Image Upload** (Cloudinary, ImgBB)

   - Add upload functionality
   - Store images in the cloud
   - Automatic optimization

3. **PWA Features**
   - Add a `manifest.json`
   - Enable "Add to Home Screen"
   - Better offline experience

## Your Devil's Toast Image Issue

If you edited the Devil's Toast image in the browser and it's different from `strains.json`, that's because **LocalStorage overrides the JSON file**.

To fix:

1. Open DevTools (F12)
2. Application/Storage → Local Storage
3. Delete `smokestack_strains`
4. Refresh the page

This resets to the `strains.json` data.

---

See [DEPLOY.md](DEPLOY.md) for more detailed deployment instructions.
