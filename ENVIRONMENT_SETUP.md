# Environment Setup

## Required Environment Variables

This project requires several environment variables to be set up for proper functionality.

### 1. Copy the example file
```bash
cp .env.example .env.local
```

### 2. Fill in your actual values

#### Supabase Configuration
- `VITE_SUPABASE_URL`: Your Supabase project URL (found in Project Settings > API)
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key (found in Project Settings > API)

#### Ragie AI Configuration  
- `VITE_RAGIE_API_KEY`: Your Ragie API key (get from https://ragie.ai)

### 3. Example .env.local file
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_RAGIE_API_KEY=tnt_your-ragie-api-key-here
```

## Security Notes

- **Never commit .env or .env.local files** - they contain sensitive API keys
- The .gitignore file is configured to exclude these files automatically
- Use .env.example as a template for new developers
- Keep your API keys secure and rotate them regularly

## Development

After setting up your environment variables, restart your development server:

```bash
npm run dev
# or
yarn dev
```