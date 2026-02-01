# Stats Implementation - How Navbar Gets User and Document Counts

## Overview
The navbar displays two key statistics:
1. **Number of Users** - from the `profiles` table
2. **Number of Documents** - from the `documents` table

## Data Flow

### 1. Navbar Component (`src/components/Navbar.tsx`)
```tsx
const { stats } = useStats();
// Displays: {stats.totalUsers} users
// Displays: {stats.totalDocuments} docs
```

### 2. useStats Hook (`src/hooks/useStats.tsx`)
The `useStats` hook fetches the counts using two methods:

#### Method 1: RPC Functions (Preferred - More Secure)
- Calls `get_profile_count()` function to count profiles
- Calls `get_document_count()` function to count documents
- These functions bypass RLS safely using `SECURITY DEFINER`

#### Method 2: Direct Queries (Fallback)
- Direct query: `supabase.from('profiles').select('*', { count: 'exact', head: true })`
- Direct query: `supabase.from('documents').select('*', { count: 'exact', head: true })`
- Uses HEAD request with `prefer: count=exact` (same as your curl command)

### 3. Database Functions (Migration: `20240201000006_allow_public_counting.sql`)
Created secure counting functions:
- `get_profile_count()` - Returns total count of profiles
- `get_document_count()` - Returns total count of documents
- Both use `SECURITY DEFINER` to bypass RLS for counting only

## How to Deploy

1. **Run the migration** to create the counting functions:
   ```bash
   supabase migration up
   ```
   Or apply the migration file: `supabase/migrations/20240201000006_allow_public_counting.sql`

2. **Redeploy the get-stats function** (if using edge functions):
   ```bash
   supabase functions deploy get-stats
   ```

## Changes Made

### Fixed Issues:
1. ✅ Removed `Math.max()` fallbacks - now shows actual counts instead of minimum values (1250, 850)
2. ✅ Added RPC functions for secure counting that bypass RLS
3. ✅ Improved error handling with proper logging
4. ✅ Updated both `useStats` hook and `get-stats` function to use actual counts

### Files Modified:
- `src/hooks/useStats.tsx` - Updated to use actual counts and RPC functions
- `supabase/functions/get-stats/index.ts` - Updated to use actual counts
- `supabase/migrations/20240201000006_allow_public_counting.sql` - New migration for counting functions

## Testing

After deploying, check the browser console for:
```
Stats fetched: {
  usersCount: <actual_number>,
  documentsCount: <actual_number>,
  ...
}
```

The navbar should now display the actual counts from your database!
