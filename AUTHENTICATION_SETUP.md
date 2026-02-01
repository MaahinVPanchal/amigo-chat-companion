# Authentication Setup with Supabase

This project now includes Supabase authentication with the following features:

## Features Implemented

1. **Supabase Integration**: Connected to your Supabase project (wanxzrrtvfofboowabkq)
2. **Authentication Modal**: Beautiful modal with wallpaper background for sign up/sign in
3. **Authentication Context**: React context for managing user state across the app
4. **Protected Actions**: "Start Interview" button now requires authentication
5. **User Interface**: Navbar shows user status and sign out option when authenticated

## How It Works

1. **Unauthenticated Users**: When clicking "Start Interview", users see the authentication modal
2. **Authentication Modal**: Users can switch between sign up and sign in modes
3. **Background Design**: Modal features the wallpaper with purple gradient overlay
4. **Authenticated Users**: Can directly start interviews and see their email in the navbar
5. **Sign Out**: Users can sign out from the navbar

## Files Created/Modified

- `src/lib/supabase.ts` - Supabase client configuration
- `src/contexts/AuthContext.tsx` - Authentication context provider
- `src/components/AuthModal.tsx` - Authentication modal component
- `src/utils/auth.ts` - Authentication utility functions
- `src/components/HeroSection.tsx` - Updated with auth integration and wallpaper background
- `src/components/Navbar.tsx` - Updated with user status display
- `src/App.tsx` - Added AuthProvider wrapper
- `.env.local` - Environment variables for Supabase configuration

## Environment Variables

The following environment variables are configured in `.env.local`:

```
VITE_SUPABASE_URL=https://wanxzrrtvfofboowabkq.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Usage

1. Start the development server: `npm run dev`
2. Click "Start Interview" to trigger authentication
3. Sign up with email/password or sign in if you have an account
4. Once authenticated, you can access interview features
5. Sign out from the navbar when needed

## Security Notes

- Environment variables are used for Supabase configuration
- `.env.local` is gitignored for security
- Only the public anon key is used (safe for client-side)
- Supabase handles all authentication security best practices