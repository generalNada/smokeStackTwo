# Authentication Implementation Plan

## Overview

Adding email + PIN authentication so users can register and have their own private strain collections.

## Complexity Estimate

### Simple Implementation (Recommended for MVP)

**Time: 2-3 hours** | **Files: ~8 new/modified**

#### What's Included:

- ✅ Email + PIN registration
- ✅ Login with email + PIN
- ✅ Session management (JWT tokens or sessions)
- ✅ Protected routes (users can only see/edit their own strains)
- ✅ Frontend login/register UI

#### Backend Changes:

1. New `users` table in database
2. `/api/auth/register` endpoint
3. `/api/auth/login` endpoint
4. `/api/auth/me` endpoint (get current user)
5. Middleware to verify authentication
6. Update strains routes to filter by user_id

#### Frontend Changes:

1. Login/Register modal or page
2. Store auth token in LocalStorage
3. Send token with API requests
4. Show/hide UI based on auth status

---

### Full-Featured Implementation

**Time: 5-8 hours** | **Files: ~15 new/modified**

#### Additional Features:

- Email verification
- PIN reset via email
- Remember me / persistent sessions
- Password strength requirements
- Rate limiting (prevent brute force)
- Account deletion
- Profile management

---

## Implementation Options

### Option 1: Simple PIN (No Email Verification) ⚡ FASTEST

- Register with email + PIN
- Login with email + PIN
- PIN stored hashed in database
- Session tokens for authentication
- **Time: 1-2 hours**

### Option 2: Email + Verified PIN (Recommended) ✅

- Register with email + PIN
- Send verification email (optional)
- Login with email + PIN
- PIN reset via email
- **Time: 2-3 hours**

### Option 3: Full Authentication System 🔒

- Everything in Option 2
- Email verification required
- Password strength validation
- Rate limiting
- Account recovery
- **Time: 4-6 hours**

---

## Database Schema Changes

### New `users` table:

```sql
CREATE TABLE users (
  _id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  pin_hash TEXT NOT NULL,
  verified BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);
```

### Update `strains` table:

```sql
ALTER TABLE strains ADD COLUMN user_id TEXT;
-- Add foreign key relationship
```

---

## Security Considerations

### What We'll Implement:

- ✅ PIN hashing (bcrypt or similar)
- ✅ JWT tokens for sessions (or express-session)
- ✅ HTTPS required in production
- ✅ CORS properly configured
- ✅ SQL injection protection (already using prepared statements)

### What We'll Skip (for simplicity):

- Email verification (can add later)
- Two-factor authentication
- OAuth (Google/Facebook login)

---

## Dependencies to Add

```json
{
  "bcryptjs": "^2.4.3", // PIN hashing
  "jsonwebtoken": "^9.0.2", // JWT tokens (OR)
  "express-session": "^1.17.3" // Session management
}
```

---

## When Does This Become Time-Consuming?

### Already Time-Consuming (Skip for MVP):

- OAuth integration (Google/Facebook) - 3-4 hours
- Email service setup (SendGrid/AWS SES) - 2-3 hours
- Two-factor authentication - 2-3 hours
- Social features (follow users, share strains) - 4-6 hours

### Reasonable (Can Do):

- Basic email + PIN auth - 2-3 hours
- User-specific strain collections - Already covered in implementation
- Session management - Included in basic implementation

---

## Recommendation

**Start with Option 1 (Simple PIN)** - Takes 1-2 hours and gives you:

- User registration
- Authentication
- Private strain collections
- Foundation to add features later

We can add email verification, password reset, etc. later if needed.

---

## Next Steps

If you want to proceed, I'll implement:

1. ✅ User registration/login system
2. ✅ Protected API routes
3. ✅ Frontend login/register UI
4. ✅ User-specific strain filtering
5. ✅ Session management

All without breaking existing functionality!
