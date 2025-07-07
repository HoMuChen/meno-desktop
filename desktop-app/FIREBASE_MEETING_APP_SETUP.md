# Firebase Meeting Application Setup Guide

## Features Implemented

✅ **Authentication System**
- Email/Password login and registration
- Google OAuth authentication
- Protected routes (redirects to login if not authenticated)
- Logout functionality

✅ **Meeting Management**
- Audio recording directly from browser
- File upload support (audio, video, PDF, documents)
- Files uploaded to Firebase Storage
- Meeting documents created in Firestore with file URLs
- Progress tracking for uploads

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable the following services:
   - **Authentication**: Enable Email/Password and Google providers
   - **Firestore Database**: Create in production mode
   - **Storage**: Create with default settings

### 2. Get Firebase Credentials

1. In Firebase Console, go to Project Settings
2. Under "Your apps", click "Add app" and select Web
3. Register your app with a nickname
4. Copy the Firebase configuration object

### 3. Configure the Application

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Firebase credentials:
   ```
   REACT_APP_FIREBASE_API_KEY=your_actual_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

### 4. Firebase Security Rules

#### Firestore Rules
Go to Firestore Database > Rules and add:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own meetings
    match /meetings/{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

#### Storage Rules
Go to Storage > Rules and add:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to read/write their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
```

### 5. Run the Application

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. For Electron desktop app:
   ```bash
   npm run electron-dev
   ```

## Application Structure

### Routes
- `/login` - Login/Registration page
- `/` - Home page (protected, requires authentication)

### Data Structure

#### Firestore Document (meetings collection)
```javascript
{
  userId: "user_uid",
  type: "audio" | "file",
  fileName: "filename.ext",
  fileUrl: "https://storage.googleapis.com/...",
  filePath: "users/uid/uploads/filename.ext",
  fileType: "mime/type", // for uploaded files
  createdBy: "user@email.com",
  size: 12345, // in bytes
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Storage Structure
```
users/
  └── {userId}/
      ├── recordings/
      │   └── audio_timestamp.webm
      └── uploads/
          └── uploaded_files.*
```

## Usage

1. **First Time Users**:
   - Click "Sign Up" on the login page
   - Enter email and password
   - Or use "Sign in with Google"

2. **Recording Audio**:
   - Click "Start Recording"
   - Allow microphone access when prompted
   - Click "Stop Recording" when done
   - Preview the recording
   - Click "Upload Recording" to save

3. **Uploading Files**:
   - Click "Choose File" or drag and drop
   - Select your meeting file
   - File uploads automatically with progress indicator

## Troubleshooting

### Common Issues

1. **"Failed to access microphone"**
   - Ensure microphone permissions are granted in browser
   - Check if microphone is being used by another application

2. **Upload fails**
   - Check Firebase Storage rules
   - Ensure you're logged in
   - Verify Storage bucket is configured in .env.local

3. **Google Sign-in not working**
   - Enable Google provider in Firebase Authentication
   - Add your domain to authorized domains in Firebase Console

### Browser Compatibility
- Audio recording uses MediaRecorder API
- Supported in modern browsers: Chrome, Firefox, Edge
- Safari may have limited support

## Next Steps

Consider adding:
- List of uploaded meetings
- Download functionality
- Delete meetings
- Search and filter
- Audio transcription
- Meeting categories/tags
- Sharing capabilities