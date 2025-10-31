# How to Clear LocalStorage and Load New Data

When you edit strains in the browser, changes are saved to LocalStorage. This **overrides** the `strains.json` file.

To load your updated `strains.json` data, you need to clear LocalStorage first.

## Quick Method (All Browsers)

### Option 1: Using Browser Console

1. Open your app (or reload if already open)
2. Press `F12` (Windows/Linux) or `Cmd+Option+I` (Mac) to open DevTools
3. Click the **Console** tab
4. Type this command and press Enter:

```javascript
localStorage.removeItem("smokestack_strains");
```

5. Refresh the page - your new `strains.json` data will load!

### Option 2: Using DevTools UI

**Chrome/Edge:**

1. Press `F12` to open DevTools
2. Go to **Application** tab
3. Click **Local Storage** in the left sidebar
4. Click on `http://localhost:8000` (or your domain)
5. Find `smokestack_strains` in the list
6. Right-click it → **Delete**
7. Refresh the page

**Firefox:**

1. Press `F12` to open DevTools
2. Go to **Storage** tab
3. Expand **Local Storage**
4. Click on your domain
5. Find `smokestack_strains`
6. Right-click → **Delete Item**
7. Refresh the page

**Safari:**

1. Enable Developer Tools: Safari → Preferences → Advanced → "Show Develop menu"
2. Press `Cmd+Option+I` to open DevTools
3. Go to **Storage** tab
4. Expand **Local Storage**
5. Click on your domain
6. Find and delete `smokestack_strains`
7. Refresh the page

## Understanding the Data Flow

```
First Visit:
strains.json → LocalStorage → App displays

After You Edit a Strain:
User edits → LocalStorage updated → strains.json ignored

Next Visit:
LocalStorage → App displays (strains.json is NOT loaded)
```

**Solution:** Clear LocalStorage when you want to load fresh data from `strains.json`

## Quick Testing

Want to test with new URLs? Add this button temporarily to your HTML:

```html
<button
  onclick="localStorage.removeItem('smokestack_strains'); location.reload()"
>
  Reset to JSON Data
</button>
```

---

**Pro Tip:** When deploying to GitHub Pages, users will only see LocalStorage data after their first edit. Consider documenting this behavior!
