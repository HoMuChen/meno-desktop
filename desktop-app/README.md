# Firebase Desktop App

A cross-platform desktop application built with React, Electron, and Firebase. This application demonstrates authentication, database operations, and file storage capabilities in a desktop environment.

## Features

- 🔐 **Firebase Authentication**: Email/Password and Google Sign-in
- 📄 **Firestore Database**: Real-time document storage and retrieval
- 📁 **Firebase Storage**: File upload and management
- 🖥️ **Cross-platform**: Windows, macOS, and Linux support
- ⚡ **Real-time Updates**: Live data synchronization
- 🎨 **Modern UI**: Clean and responsive interface

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable the following services:
   - **Authentication**: Enable Email/Password and Google providers
   - **Firestore Database**: Create a database in test mode
   - **Storage**: Set up Firebase Storage
4. Get your Firebase configuration from Project Settings > General > Your apps
5. Replace the configuration in `src/firebase/config.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

### Running the React App (Web)
```bash
npm start
```

### Running the Electron App (Desktop)
```bash
npm run electron-dev
```

This will start the React development server and launch the Electron application.

## Building for Production

### Build React App
```bash
npm run build
```

### Build Electron App
```bash
npm run build-electron
```

This will create distributable files in the `dist/` folder.

## Project Structure

```
desktop-app/
├── public/
│   ├── electron.js          # Main Electron process
│   ├── preload.js           # Preload script for security
│   └── index.html           # HTML template
├── src/
│   ├── components/
│   │   └── Login.tsx        # Login/Signup component
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication context
│   ├── firebase/
│   │   ├── config.ts        # Firebase configuration
│   │   ├── auth.ts          # Authentication services
│   │   ├── database.ts      # Firestore database services
│   │   └── storage.ts       # Firebase Storage services
│   ├── App.tsx              # Main application component
│   └── index.tsx            # React entry point
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## Available Scripts

- `npm start` - Start React development server
- `npm run build` - Build React app for production
- `npm run electron` - Start Electron with built files
- `npm run electron-dev` - Start Electron in development mode
- `npm run build-electron` - Build Electron app for distribution
- `npm test` - Run tests

## Firebase Services Used

### Authentication
- Email/Password authentication
- Google Sign-in
- User state management
- Password reset functionality

### Firestore Database
- Document creation and retrieval
- Real-time listeners
- Query operations
- User-specific data isolation

### Storage
- File upload with progress tracking
- File metadata management
- User-specific file organization
- Download URL generation

## Usage

1. Start the application using `npm run electron-dev`
2. Register a new account or login with existing credentials
3. Use Google Sign-in for quick authentication
4. Create documents in the Document Management section
5. Upload files using the File Upload section
6. All data is automatically synced with Firebase

## Security Features

- Context isolation in Electron
- Secure Firebase rules (configure in Firebase Console)
- No direct Node.js access from renderer process
- Preload script for secure API exposure

## Building for Distribution

The application can be built for multiple platforms:

### Windows
```bash
npm run build-electron
```

### macOS
```bash
npm run build-electron
```

### Linux
```bash
npm run build-electron
```

## Troubleshooting

### Firebase Configuration
- Ensure all Firebase services are enabled in your project
- Check that the configuration in `config.ts` matches your Firebase project
- Verify authentication providers are enabled

### Electron Issues
- Clear `node_modules` and reinstall if facing dependency issues
- Check that all required dependencies are installed

### Build Issues
- Ensure you have the latest Node.js version
- Run `npm run build` before building the Electron app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Firebase documentation
3. Check Electron documentation
4. Create an issue in the repository

## Next Steps

- Implement offline support
- Add more authentication providers
- Implement real-time notifications
- Add data export/import features
- Implement user profile management
- Add advanced file management features
