import { signIn, signUp, signInWithGoogle, logOut } from '../../firebase/auth';

// Mock the entire firebase/auth module
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateProfile: jest.fn(),
}));

// Mock the Firebase config
jest.mock('../../firebase/config', () => ({
  auth: 'mock-auth-instance',
  db: 'mock-db-instance',
  storage: 'mock-storage-instance',
}));

describe('Firebase Auth Service', () => {
  const mockSignInWithEmailAndPassword = require('firebase/auth').signInWithEmailAndPassword;
  const mockCreateUserWithEmailAndPassword = require('firebase/auth').createUserWithEmailAndPassword;
  const mockSignInWithPopup = require('firebase/auth').signInWithPopup;
  const mockSignOut = require('firebase/auth').signOut;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should sign in user with valid credentials', async () => {
      const mockUser = { 
        uid: '123', 
        email: 'test@example.com',
        displayName: 'Test User'
      };
      
      mockSignInWithEmailAndPassword.mockResolvedValue({
        user: mockUser
      });

      const result = await signIn('test@example.com', 'password');
      
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        'mock-auth-instance',
        'test@example.com',
        'password'
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw error for invalid credentials', async () => {
      const error = new Error('Invalid credentials');
      mockSignInWithEmailAndPassword.mockRejectedValue(error);

      await expect(signIn('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });


  });

  describe('signUp', () => {
    it('should create new user account', async () => {
      const mockUser = { 
        uid: '456', 
        email: 'newuser@example.com' 
      };
      
      mockCreateUserWithEmailAndPassword.mockResolvedValue({
        user: mockUser
      });

      const result = await signUp('newuser@example.com', 'password123');
      
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        'mock-auth-instance',
        'newuser@example.com',
        'password123'
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle email already in use error', async () => {
      const error = new Error('Email already in use');
      mockCreateUserWithEmailAndPassword.mockRejectedValue(error);

      await expect(signUp('existing@example.com', 'password')).rejects.toThrow('Email already in use');
    });
  });

  describe('signInWithGoogle', () => {
    it('should sign in with Google successfully', async () => {
      const mockUser = { 
        uid: '789', 
        email: 'google@example.com',
        displayName: 'Google User'
      };
      
      mockSignInWithPopup.mockResolvedValue({
        user: mockUser
      });

      const result = await signInWithGoogle();
      
      expect(mockSignInWithPopup).toHaveBeenCalledWith(
        'mock-auth-instance',
        expect.any(Object) // GoogleAuthProvider instance
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle popup cancelled', async () => {
      const error = new Error('Popup cancelled');
      mockSignInWithPopup.mockRejectedValue(error);

      await expect(signInWithGoogle()).rejects.toThrow('Popup cancelled');
    });
  });

  describe('logOut', () => {
    it('should sign out user successfully', async () => {
      mockSignOut.mockResolvedValue(undefined);

      await expect(logOut()).resolves.toBeUndefined();
      expect(mockSignOut).toHaveBeenCalledWith('mock-auth-instance');
    });

    it('should handle sign out errors', async () => {
      const error = new Error('Sign out failed');
      mockSignOut.mockRejectedValue(error);

      await expect(logOut()).rejects.toThrow('Sign out failed');
    });
  });
});