# SmokeStack Backend API

Express.js backend API for the SmokeStack application. Provides RESTful endpoints for managing cannabis strain data.

## Features

- ✅ RESTful API endpoints (GET, POST, PUT, DELETE)
- ✅ SQLite database with MongoDB-style ID compatibility
- ✅ CORS enabled for frontend integration
- ✅ Environment variable configuration
- ✅ Error handling and validation
- ✅ Health check endpoint

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_PATH=./data/strains.db

# API Configuration
API_BASE_URL=/api

# CORS Configuration (comma-separated origins, or * for all)
CORS_ORIGIN=*
```

For local development with the frontend:

```env
CORS_ORIGIN=http://localhost:8000,http://127.0.0.1:8000
```

### 3. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

### Health Check

- **GET** `/health` - Server status check

### Strains

- **GET** `/api/strains` - Get all strains
- **GET** `/api/strains/:id` - Get strain by ID
- **POST** `/api/strains` - Create new strain
- **PUT** `/api/strains/:id` - Update strain
- **DELETE** `/api/strains/:id` - Delete strain

## Request/Response Examples

### Create Strain

```bash
POST /api/strains
Content-Type: application/json

{
  "name": "Blue Dream",
  "type": "Hybrid",
  "source": "Local Dispensary",
  "image": "https://example.com/image.jpg",
  "setting": "Evening relaxation",
  "format": "Flower",
  "stoner": "Me",
  "impressions": "Smooth and balanced",
  "other": "Great for beginners"
}
```

### Update Strain

```bash
PUT /api/strains/abc123
Content-Type: application/json

{
  "name": "Blue Dream",
  "type": "Hybrid",
  "source": "Updated Source",
  ...
}
```

## Database

The backend uses SQLite with a `strains` table. The database file is created automatically at the path specified in `DB_PATH` (default: `./data/strains.db`).

### Schema

- `_id` (TEXT, PRIMARY KEY) - MongoDB-style ID
- `id` (TEXT, UNIQUE) - Alias for \_id (for compatibility)
- `name` (TEXT, NOT NULL)
- `type` (TEXT, NOT NULL)
- `source` (TEXT)
- `image` (TEXT)
- `setting` (TEXT)
- `format` (TEXT)
- `stoner` (TEXT)
- `impressions` (TEXT)
- `other` (TEXT)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

## Frontend Integration

### Local Development

1. Start the backend server: `cd backend && npm run dev`
2. Update `script.js` to point to local API:
   ```javascript
   const API_BASE = "http://localhost:3000/api";
   ```
3. Start your frontend server (e.g., Python HTTP server on port 8000)
4. The frontend will now communicate with your local backend

### Production Deployment

When deploying to Render/Railway/DigitalOcean:

1. Set environment variables in your hosting platform
2. Update `API_BASE` in `script.js` to point to your deployed backend URL
3. Ensure CORS_ORIGIN includes your GitHub Pages domain

## Project Structure

```
backend/
├── server.js              # Main Express server
├── db.js                  # Database connection and queries
├── routes/
│   └── strains.js        # Strain routes
├── controllers/
│   └── strainController.js  # Strain business logic
├── data/                 # SQLite database (gitignored)
├── .env                  # Environment variables (gitignored)
├── package.json
└── README.md
```

## Notes

- The backend is designed to work alongside the existing DigitalOcean API
- Frontend code doesn't need to change - it already supports API-first with fallbacks
- The database automatically handles both `_id` and `id` fields for compatibility
- SQLite database files are gitignored - they'll be created on first run

## Troubleshooting

**Port already in use:**

```bash
# Change PORT in .env or kill the process using the port
lsof -ti:3000 | xargs kill -9
```

**CORS errors:**

- Make sure `CORS_ORIGIN` in `.env` includes your frontend URL
- Check browser console for specific CORS error messages

**Database errors:**

- Ensure the `data/` directory is writable
- Check that `DB_PATH` in `.env` is correct
