import { signIn, signUp, signInWithGoogle, logOut } from '../../src/firebase/auth';

// Mock Firebase auth
jest.mock('../../src/firebase/config', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
  }
}));

// Mock Firebase auth providers
jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
}));

describe('Firebase Auth Service', () => {
  const mockAuth = require('../../src/firebase/config').auth;
  
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
      
      mockAuth.signInWithEmailAndPassword.mockResolvedValue({
        user: mockUser
      });

      const result = await signIn('test@example.com', 'password');
      
      expect(mockAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        'test@example.com',
        'password'
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw error for invalid credentials', async () => {
      const error = new Error('Invalid credentials');
      mockAuth.signInWithEmailAndPassword.mockRejectedValue(error);

      await expect(signIn('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockAuth.signInWithEmailAndPassword.mockRejectedValue(networkError);

      await expect(signIn('test@example.com', 'password')).rejects.toThrow('Network error');
    });
  });

  describe('signUp', () => {
    it('should create new user account', async () => {
      const mockUser = { 
        uid: '456', 
        email: 'newuser@example.com' 
      };
      
      mockAuth.createUserWithEmailAndPassword.mockResolvedValue({
        user: mockUser
      });

      const result = await signUp('newuser@example.com', 'password123');
      
      expect(mockAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        'newuser@example.com',
        'password123'
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle email already in use error', async () => {
      const error = new Error('Email already in use');
      mockAuth.createUserWithEmailAndPassword.mockRejectedValue(error);

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
      
      mockAuth.signInWithPopup.mockResolvedValue({
        user: mockUser
      });

      const result = await signInWithGoogle();
      
      expect(mockAuth.signInWithPopup).toHaveBeenCalledWith(
        mockAuth,
        expect.any(Object) // GoogleAuthProvider instance
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle popup cancelled', async () => {
      const error = new Error('Popup cancelled');
      mockAuth.signInWithPopup.mockRejectedValue(error);

      await expect(signInWithGoogle()).rejects.toThrow('Popup cancelled');
    });
  });

  describe('logOut', () => {
    it('should sign out user successfully', async () => {
      mockAuth.signOut.mockResolvedValue(undefined);

      await expect(logOut()).resolves.toBeUndefined();
      expect(mockAuth.signOut).toHaveBeenCalledWith(mockAuth);
    });

    it('should handle sign out errors', async () => {
      const error = new Error('Sign out failed');
      mockAuth.signOut.mockRejectedValue(error);

      await expect(logOut()).rejects.toThrow('Sign out failed');
    });
  });
});