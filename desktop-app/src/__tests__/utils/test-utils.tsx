import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock Firebase configuration
jest.mock('../../firebase/config', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
    currentUser: null,
  },
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
  },
  storage: {
    ref: jest.fn(),
  }
}));

// Mock Firebase auth functions
jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateProfile: jest.fn(),
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ seconds: Date.now() / 1000 })),
  },
}));

// Mock Firebase Storage
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  uploadBytesResumable: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
  listAll: jest.fn(),
  getMetadata: jest.fn(),
}));

// Mock Electron APIs
global.window.electronAPI = {
  getAppVersion: jest.fn(() => Promise.resolve('1.0.0')),
  showNotification: jest.fn(),
  openFile: jest.fn(),
  saveFile: jest.fn(),
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  uid: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
  ...overrides,
});

export const createMockDocument = (overrides = {}) => ({
  id: 'test-doc-id',
  title: 'Test Document',
  content: 'Test content',
  createdAt: { toDate: () => new Date() },
  updatedAt: { toDate: () => new Date() },
  ...overrides,
});

export const createMockFile = (overrides = {}) => {
  const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
  Object.assign(file, overrides);
  return file;
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialUser?: any;
}

const AllTheProviders: React.FC<{ children: React.ReactNode; initialUser?: any }> = ({
  children,
  initialUser = null,
}) => {
  // Mock the auth context if needed
  return <AuthProvider>{children}</AuthProvider>;
};

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialUser, ...renderOptions } = options;

  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} initialUser={initialUser} />,
    ...renderOptions,
  });
};

// Utility functions for testing
export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect();
        resolve(undefined);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
};

export const mockFirebaseAuth = {
  signIn: jest.fn(),
  signUp: jest.fn(),
  signInWithGoogle: jest.fn(),
  logOut: jest.fn(),
  resetPassword: jest.fn(),
  updateUserProfile: jest.fn(),
  onAuthStateChange: jest.fn(),
  getCurrentUser: jest.fn(),
};

export const mockFirebaseDb = {
  addDocument: jest.fn(),
  getDocument: jest.fn(),
  getDocuments: jest.fn(),
  updateDocument: jest.fn(),
  deleteDocument: jest.fn(),
  queryDocuments: jest.fn(),
  subscribeToDocument: jest.fn(),
  subscribeToCollection: jest.fn(),
};

export const mockFirebaseStorage = {
  uploadFile: jest.fn(),
  uploadFileWithProgress: jest.fn(),
  deleteFile: jest.fn(),
  getFileDownloadURL: jest.fn(),
  listFiles: jest.fn(),
  getFileMetadata: jest.fn(),
  uploadMultipleFiles: jest.fn(),
};

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };