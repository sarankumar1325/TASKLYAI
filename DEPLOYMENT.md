# TaskFlow AI - Vercel Deployment Guide

## Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Have a Vercel account
3. GitHub repository with your code

## Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from Project Root
```bash
cd c:\Users\GANES\OneDrive\Documents\REACT\TODOAI\glassflow-ai-tasks
vercel --prod
```

### 4. Configure Project Settings
When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your personal account or team
- **Link to existing project?** → No
- **Project name?** → `taskflow-ai`
- **Directory?** → `./` (current directory)
- **Override settings?** → Yes (if needed)

### 5. Environment Variables
Set these in Vercel Dashboard or via CLI:

```bash
vercel env add VITE_CLERK_PUBLISHABLE_KEY
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_GROQ_API_KEY
```

Values:
- `VITE_CLERK_PUBLISHABLE_KEY`: `pk_test_bmV1dHJhbC13ZXJld29sZi0xMy5jbGVyay5hY2NvdW50cy5kZXYk`
- `VITE_SUPABASE_URL`: `https://dmlyxtqnbpmzzqroehnq.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtbHl4dHFuYnBtenpxcm9laG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMTgwNzksImV4cCI6MjA2NjY5NDA3OX0.nE1jdvJTQEiZmzb5LrCzDSPuOFdFUESxxM0KVf4ZDBE`
- `VITE_GROQ_API_KEY`: `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`

### 6. Custom Domain Setup
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `taskflowai.vercel.app`
3. Vercel will automatically configure the domain

### 7. Redeploy
```bash
vercel --prod
```

## Alternative: GitHub Integration

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - TaskFlow AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/taskflow-ai.git
git push -u origin main
```

### 2. Import to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub
4. Select your repository
5. Configure:
   - **Project Name**: `taskflow-ai`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variables (same as above)
7. Deploy

## Post-Deployment

### Update Clerk Redirect URLs
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to your application
3. Go to "Redirects" or "Allowed Redirect URLs"
4. Add: `https://taskflowai.vercel.app/*`

### Update Supabase Auth Settings
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project
3. Go to Authentication → URL Configuration
4. Add: `https://taskflowai.vercel.app` to Site URL
5. Add: `https://taskflowai.vercel.app/**` to Redirect URLs

## Verification
- Visit: https://taskflowai.vercel.app
- Test authentication flow
- Test task creation and AI features
- Check all functionality works in production

## Troubleshooting

### Build Errors
- Check environment variables are set correctly
- Ensure all dependencies are in package.json
- Check Vercel build logs

### Authentication Issues
- Verify Clerk redirect URLs
- Check Supabase Auth settings
- Ensure environment variables are correct

### API Issues
- Check GROQ API key is valid
- Verify Supabase connection
- Check browser console for errors
