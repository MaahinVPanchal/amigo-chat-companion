# Supabase Backend for Amigo Chat Companion

Simple Supabase setup with authentication and profiles only.

## 📁 Directory Structure

```
supabase/
├── config.toml              # Supabase project configuration
├── seed.sql                 # Simple database setup with profiles
├── migrations/              # Database schema migrations
│   └── 20240201000001_initial_schema.sql
├── functions/               # Supabase Edge Functions
│   ├── _shared/            # Shared utilities
│   │   ├── cors.ts         # CORS handling
│   │   └── supabase.ts     # Supabase client utilities
│   ├── signup/             # User signup function
│   └── login/              # User login function
└── sql/                    # SQL queries
    └── profiles.sql        # Profile table queries
```

## 🚀 Setup Instructions

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Link to Your Project
```bash
supabase link --project-ref wanxzrrtvfofboowabkq
```

### 4. Push Database Schema
```bash
supabase db push
```

### 5. Deploy Edge Functions
```bash
supabase functions deploy signup
supabase functions deploy login
```

## 📊 Database Schema

### Tables

1. **profiles** - Extended user profiles
   - Links to `auth.users`
   - Stores email, full_name, avatar_url
   - Automatically created on user signup

### Row Level Security (RLS)

- Users can only access their own profile data
- Proper authentication is required for all operations

## 🔧 Edge Functions

### signup
Creates a new user account with email and password.

**Endpoint:** `POST /functions/v1/signup`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}
```

### login
Authenticates user with email and password.

**Endpoint:** `POST /functions/v1/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

## 📝 SQL Queries

### Get User Profile
```sql
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.avatar_url,
  p.created_at,
  p.updated_at
FROM public.profiles p
WHERE p.id = 'USER_ID_HERE';
```

### Update User Profile
```sql
UPDATE public.profiles 
SET 
  full_name = 'New Name',
  avatar_url = 'https://example.com/avatar.jpg',
  updated_at = NOW()
WHERE id = 'USER_ID_HERE';
```

## 🔐 Environment Variables

- `SUPABASE_URL`: https://wanxzrrtvfofboowabkq.supabase.co
- `SUPABASE_ANON_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhbnh6cnJ0dmZvZmJvb3dhYmtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MjAyMjEsImV4cCI6MjA4NTQ5NjIyMX0.4rz8pL_-7RrhuKkEYiMVG13xV8rvl4FtIqppCSWo5vY

## 🧪 Testing

Test functions locally:
```bash
supabase functions serve
```

Then make requests to `http://localhost:54321/functions/v1/signup` or `http://localhost:54321/functions/v1/login`