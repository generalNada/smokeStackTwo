# SmokeStack Quick Start

## To Use Your Own Images

### 1. Edit `strains.json`

Replace the `image` URLs with your own:

```json
{
  "id": 1,
  "name": "Devil's Toast",
  "image": "YOUR_IMAGE_URL_HERE",
  ...
}
```

### 2. Clear Old Data (IMPORTANT!)

Your browser may have cached the old data. Clear it:

**Fastest Method:**

1. Open the app in your browser
2. Press `F12` (or `Cmd+Option+I` on Mac)
3. Click **Console** tab
4. Type: `localStorage.removeItem('smokestack_strains')`
5. Press Enter
6. Refresh the page (F5 or Cmd+R)

### 3. Verify

You should see your new images!

---

## Why Do I Need to Clear?

When you edit strains in the app, changes are saved to **browser LocalStorage**. This LocalStorage data takes priority over `strains.json`.

So when you update `strains.json` with new images, your browser ignores it unless you clear the old LocalStorage data first.

---

## Deploy to GitHub Pages

Once your images are working locally:

```bash
git init
git add .
git commit -m "Add SmokeStack with custom images"
git remote add origin https://github.com/YOUR_USERNAME/smokeStack.git
git push -u origin main
```

Then enable GitHub Pages in Settings → Pages

---

See [README.md](README.md) for full documentation.
