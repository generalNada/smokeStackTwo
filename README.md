# SmokeStack

A personal cannabis strain tracker built with pure HTML, CSS, and JavaScript - no frameworks required!

## Features

✨ **Mobile-First Design** - Optimized for phones and smaller screens  
🎨 **Custom Styling** - Beautiful UI with soft rounded cards and custom icons  
🏷️ **Strain Badges** - Color-coded badges for Sativa (green), Indica (purple), and Hybrid (blue)  
🖼️ **Image Support** - Display strain photos in list and detail views  
🔍 **Live Search** - Filter strains by name, type, source, or setting  
💾 **LocalStorage** - All data saved locally in your browser  
📱 **Offline Ready** - Works without internet connection  
🎬 **Smooth Animations** - Animated transitions when opening/closing entries

## Getting Started

### Quick Start

1. Clone or download this repository
2. Start a local web server:

   **Python 3:**

   ```bash
   python3 -m http.server 8000
   ```

   **Python 2:**

   ```bash
   python -m SimpleHTTPServer 8000
   ```

   **Node.js:**

   ```bash
   npx http-server
   ```

3. Open your browser and navigate to `http://localhost:8000`

### Deploy to GitHub Pages

This app is ready to deploy on GitHub Pages! Here's how:

1. Push this code to a GitHub repository
2. Go to your repository Settings → Pages
3. Select the `main` branch (or your default branch) as the source
4. Click Save
5. Your app will be live at `https://yourusername.github.io/repository-name/`

**Note:** Make sure `index.html` is in the root directory of your repository.

### File Structure

```
smokeStackTwo/
├── index.html      # Main HTML structure
├── style.css       # All styling and animations
├── script.js       # Application logic and data management
├── strains.json    # Initial data (6 sample strains)
└── README.md       # This file
```

## Usage

### View Strains

- Browse all strains in the main list view
- Each entry shows thumbnail image, type badge, name, and source
- Tap any entry to view full details with large image

### Search

- Use the search bar at the top to filter strains
- Searches across name, type, source, and setting fields

### Add New Strain

- Tap the **+** button in the top right
- Fill in the strain details (including optional image URL)
- Tap **Save** to add it to your collection

### Edit Strain

- Open a strain's detail view
- Tap the **Edit** button
- Make your changes and tap **Save**

### Navigate

- Use the **←** back button to return to the list
- Bottom navigation bar provides quick access to main views

## Data Storage

- **Initial Load**: Data loads from `strains.json` on first visit
- **After Edits**: All changes are saved to browser LocalStorage
- **Offline**: Once loaded, the app works completely offline
- **No Backend**: Everything runs locally in your browser

### Resetting Your Data

If you want to reset to the original `strains.json` data:

**Quick Method (Console):**

1. Open DevTools (F12 or Cmd+Option+I)
2. Go to **Console** tab
3. Type: `localStorage.removeItem('smokestack_strains')`
4. Press Enter
5. Refresh the page

**GUI Method:**

1. Open DevTools (F12 or Cmd+Option+I)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** → `http://localhost:8000` (or your domain)
4. Right-click `smokestack_strains` → Delete
5. Refresh the page

This will reload data from `strains.json`. See [CLEAR_LOCALSTORAGE.md](CLEAR_LOCALSTORAGE.md) for detailed instructions.

## Customization

### Colors

Edit the CSS variables in `style.css`:

```css
:root {
  --olive-green: #6b8e23;
  --sativa-green: #4caf50;
  --indica-purple: #9c27b0;
  --hybrid-blue: #2196f3;
  /* ... more colors */
}
```

### Images

Images are currently loaded from hardcoded URLs. To integrate with Cloudinary or another CDN:

1. Add your image URL in the strain form
2. For Cloudinary: Upload images via Cloudinary's API and use their URL format
3. Images are stored as simple URL strings in the data structure
4. Thumbnails (60x60) and detail images (up to 250px height) are automatically sized

**Example Cloudinary URL:**

```
https://res.cloudinary.com/your-cloud/image/upload/w_300,h_300,c_fill/v1234567890/strain-name.jpg
```

### Adding More Fields

1. Update the HTML form in `index.html`
2. Add corresponding fields in `script.js` form handler
3. Update the detail view to display new fields

## Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to use this for your own projects!

## Acknowledgments

Originally inspired by a Glide app. Rebuilt with vanilla JavaScript for complete control and customization.

---

**Enjoy tracking your strains! 🌿**
