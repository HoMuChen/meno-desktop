# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a cross-platform desktop application built with React, TypeScript, and Electron, using Firebase as the backend service. The app provides document management, file storage, and real-time data synchronization capabilities.

**Tech Stack:**
- React 19.1.0 with TypeScript
- Electron 37.2.0 for desktop packaging
- Firebase (Authentication, Firestore, Storage)
- Jest & Playwright for testing

## Architecture

### Service Layer Pattern
Firebase services are organized into separate modules in `desktop-app/src/firebase/`:
- `auth.ts` - Authentication operations
- `database.ts` - Firestore CRUD operations
- `storage.ts` - File upload/download operations

### Authentication Flow
- Context-based auth state management in `AuthContext.tsx`
- Protected routes using `ProtectedRoute.tsx` component
- Supports Email/Password and Google Sign-in

### Security Architecture
- Electron context isolation enabled
- Preload script for secure IPC communication
- Environment variables for Firebase configuration (never commit .env files)

## Key Commands

### Development
```bash
cd desktop-app
npm run electron-dev    # Starts both React and Electron in dev mode
```

### Testing
```bash
npm test                 # React test runner (watch mode)
npm run test:unit        # Run unit tests once
npm run test:e2e         # Run Playwright E2E tests
npm run test:all         # Run all tests
```

### Building
```bash
npm run build           # Build React app
npm run build-electron  # Build desktop app for all platforms
```

## Project Structure

```
desktop-app/
├── public/
│   ├── electron.js     # Main Electron process
│   └── preload.js      # Secure bridge between main and renderer
├── src/
│   ├── components/     # React components (Login, Home, ProtectedRoute)
│   ├── contexts/       # React contexts (AuthContext)
│   ├── firebase/       # Firebase service layer
│   └── __tests__/      # Test files
└── e2e/               # Playwright E2E tests
```

## Environment Setup

Create `desktop-app/.env.local` with Firebase credentials:
```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

## Testing Strategy

The project follows a testing pyramid approach:
1. **Unit Tests**: Jest + React Testing Library for components and services
2. **Integration Tests**: Testing Firebase service interactions
3. **E2E Tests**: Playwright for full user workflows

Coverage thresholds are set at 50% for all metrics.

## Common Development Tasks

### Adding a New Firebase Collection
1. Create types in the relevant service file
2. Add CRUD operations in `database.ts`
3. Create corresponding React hooks if needed
4. Add tests for the new operations

### Running a Single Test
```bash
npm test -- --testNamePattern="test name"    # Jest
npm run test:e2e -- --grep "test name"       # Playwright
```

### Debugging Electron
- Main process logs appear in terminal
- Renderer process: Open DevTools with Cmd+Option+I (Mac) or Ctrl+Shift+I (Windows/Linux)

## Important Notes

- Always use TypeScript strict mode
- Firebase operations should handle errors gracefully
- E2E tests require the app to be running on port 3000
- Electron Builder config is in package.json under "build" section
- Test files should be colocated with source files or in __tests__ directories