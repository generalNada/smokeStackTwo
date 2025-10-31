# Deploy SmokeStack to GitHub Pages

SmokeStack is fully compatible with GitHub Pages! Here's how to deploy it:

## Quick Deployment

### Step 1: Create a GitHub Repository

If you haven't already:

```bash
git init
git add .
git commit -m "Initial commit: SmokeStack strain tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (in the repository menu)
3. Scroll down to **Pages** (in the left sidebar)
4. Under **Source**, select:
   - Branch: `main` (or your default branch)
   - Folder: `/ (root)`
5. Click **Save**

### Step 3: Access Your App

Your app will be live at:

```
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY-NAME/
```

It may take a few minutes for the site to be available.

## Important Notes

### ✅ What Works on GitHub Pages

- ✅ All HTML, CSS, and JavaScript
- ✅ Static JSON file loading (`strains.json`)
- ✅ Browser LocalStorage (data persists per user)
- ✅ External image URLs (Unsplash, Cloudinary, etc.)
- ✅ All CRUD operations
- ✅ Search functionality
- ✅ Responsive design

### ⚠️ Important Considerations

**Data Storage:**

- Initial strains load from `strains.json`
- User edits are saved to **browser LocalStorage** only
- Data is **NOT synced** across devices or sessions
- Each user's edits are local to their browser

**Images:**

- Currently using external URLs (Unsplash)
- For production, consider:
  - Cloudinary for image hosting
  - GitHub Pages doesn't support uploads
  - Store images externally and reference URLs

### Alternative Hosting Options

If you need more features, consider:

- **Netlify** - Free hosting with form handling
- **Vercel** - Great for static sites
- **Firebase Hosting** - Integrated with Firebase backend
- **Cloudflare Pages** - Fast CDN

## Custom Domain

You can add a custom domain in the same GitHub Pages settings:

1. Go to Settings → Pages
2. Add your domain in the "Custom domain" field
3. Follow the DNS configuration instructions

---

**Questions?** Check the main [README.md](README.md) for more details.
