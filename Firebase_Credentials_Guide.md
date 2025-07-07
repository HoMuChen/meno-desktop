# Firebase Credentials Setup Guide

## Overview
This guide explains how to securely store and manage Firebase credentials in your Electron + React desktop application.

## ✅ Recommended Approach: Environment Variables

### 1. **Create Your Environment File**

In the `desktop-app` directory, create a `.env.local` file:

```bash
# Copy from .env.example and fill in your actual Firebase credentials
cp .env.example .env.local
```

### 2. **Add Your Firebase Credentials**

Edit `.env.local` with your actual Firebase project credentials:

```bash
REACT_APP_FIREBASE_API_KEY=AIzaSyC...your-actual-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-actual-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

### 3. **Where to Find Your Firebase Credentials**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click on ⚙️ **Project Settings**
4. Scroll down to **Your apps** section
5. Click on the **Web app** (</> icon)
6. Copy the configuration values

## 🔐 Security Best Practices

### ✅ What's Safe to Commit
- `.env.example` - Template with placeholder values
- `src/firebase/config.ts` - Configuration code (no actual credentials)

### ❌ NEVER Commit These Files
- `.env.local` - Contains your actual credentials
- Any file with real Firebase API keys

### 🛡️ Additional Security Measures

1. **Firebase Security Rules**: Set up proper Firestore and Storage rules
2. **API Key Restrictions**: In Firebase Console, restrict your API keys to specific domains
3. **Environment-Specific Projects**: Use different Firebase projects for development and production

## 🚀 Development Workflow

### Starting Development
```bash
cd desktop-app
npm install
npm run electron-dev
```

### Production Build
```bash
npm run build-electron
```

For production, you'll need to handle credentials differently:
- Use environment variables in your build environment
- Consider using Firebase Admin SDK for server-side operations
- Never bundle credentials in the final executable

## 📁 File Structure

```
desktop-app/
├── .env.example          # Template (safe to commit)
├── .env.local           # Your credentials (NEVER commit)
├── .gitignore           # Excludes .env.local
└── src/
    └── firebase/
        └── config.ts    # Configuration using env vars
```

## 🔧 Configuration Details

The Firebase configuration automatically:
- Loads environment variables at build time
- Validates that all required variables are present
- Throws helpful error messages if credentials are missing

## 🏗️ Environment-Specific Setup

### Development
Use `.env.local` for local development credentials

### Production
Set environment variables in your build environment:
```bash
export REACT_APP_FIREBASE_API_KEY="your-production-key"
export REACT_APP_FIREBASE_AUTH_DOMAIN="your-production-domain"
# ... etc
```

## 📝 Notes for Electron

- Environment variables are processed at build time by React
- The main Electron process and renderer process both have access to these variables
- For additional security in production, consider using Electron's secure storage APIs

## 🆘 Troubleshooting

### "Missing required Firebase environment variables"
1. Check that `.env.local` exists in the `desktop-app` directory
2. Verify all required variables are set with `REACT_APP_` prefix
3. Restart your development server after adding new environment variables

### TypeScript Errors
If you see TypeScript errors related to `process.env`, the configuration has been updated to handle this properly.

## 🔄 Migration from Hardcoded Values

If you previously had hardcoded Firebase credentials, they have been replaced with environment variables. Update your `.env.local` file with the actual values that were previously hardcoded.