# Firebase Setup Guide

This guide explains how to set up Firebase credentials for this Electron/React desktop application.

## Where to Get Your Firebase Credentials

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click on the gear icon ⚙️ and select "Project settings"
4. In the "General" tab, scroll down to "Your apps"
5. If you haven't added a web app yet, click "Add app" and select the web platform
6. Copy the configuration object values

## Setting Up Credentials Locally

### Method 1: Environment Variables (Recommended)

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values with your actual Firebase credentials:
   ```
   REACT_APP_FIREBASE_API_KEY=your-actual-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

3. Restart your development server for the changes to take effect:
   ```bash
   npm start
   ```

### Important Security Notes

- **Never commit `.env.local` to version control** - it's already in `.gitignore`
- The `.env.example` file is safe to commit as it contains only placeholder values
- For production builds, set these environment variables in your build environment

## Different Environments

You can create multiple environment files for different stages:

- `.env.local` - Local development (highest priority)
- `.env.development.local` - Development-specific overrides
- `.env.production.local` - Production-specific values (for local production builds)
- `.env.test.local` - Test environment configuration

## Electron Considerations

Since this is an Electron app, Firebase credentials will be embedded in the distributed application. Consider:

1. **Firebase Security Rules**: Implement strict security rules in Firebase Console
2. **App Check**: Enable Firebase App Check for additional security
3. **API Key Restrictions**: Restrict your API key in Google Cloud Console to specific domains/apps
4. **Authentication**: Always require user authentication before accessing sensitive data

## Troubleshooting

### TypeScript Errors
If you see TypeScript errors about `process.env`, this is normal in the IDE. Create React App handles environment variables at build time, so the app will work correctly when running.

### Environment Variables Not Working
1. Ensure variable names start with `REACT_APP_`
2. Restart the development server after changing `.env.local`
3. Check that `.env.local` is in the correct directory (`desktop-app/`)

### Firebase Connection Issues
1. Verify all credentials are correct
2. Check Firebase project settings for any restrictions
3. Ensure your Firebase project is active (not deleted or suspended)

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Create React App - Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/basics)