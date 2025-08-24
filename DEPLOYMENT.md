# Deployment Guide

## Pre-Deployment Checklist ✅

- ✅ **Build works correctly** - `npm run build` completes without errors
- ✅ **No hardcoded localhost URLs** - All API calls use relative paths or Supabase client
- ✅ **Dependencies are correct** - All required packages in package.json
- ✅ **Supabase credentials configured** - Using production Supabase instance
- ✅ **No exposed secrets** - Supabase anon key is safe to expose (it's public)

## Deployment Platforms

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy with default settings (Vercel auto-detects Vite)

### Netlify
1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Railway/Render
1. Push code to GitHub
2. Connect repository
3. Build command: `npm run build`
4. Start command: `npm run preview` (or use a static file server)

## Important Notes

### Supabase Configuration
- ✅ URL: `https://jgeddimrwlbrnuzvmyhx.supabase.co`
- ✅ Anon key is already in the code (safe for production)
- ✅ Row Level Security (RLS) is enabled on all tables

### Authentication Settings
In Supabase Dashboard:
1. Go to Authentication → Settings
2. For production, enable "Confirm email" 
3. Configure allowed email domains if needed
4. Set up SMTP for email verification (optional but recommended)

### Database Security
The following policies are active:
- Users can only view/edit their own profiles
- Automatic profile creation on signup via trigger
- Admin role managed via `is_admin` column

### Environment Variables
No environment variables needed! Supabase credentials are safe to expose in frontend code.

## Post-Deployment

1. Test signup flow
2. Test login flow  
3. Verify profile creation
4. Check browser console for any errors

## Build Output
- Build size: ~425KB (gzipped: ~125KB)
- Assets optimized and minified
- Images included in bundle

Your app is ready for deployment! 🚀