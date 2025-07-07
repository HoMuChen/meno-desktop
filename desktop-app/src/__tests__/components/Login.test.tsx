import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../components/Login';

// Mock Firebase auth functions
jest.mock('../../firebase/auth', () => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
  signInWithGoogle: jest.fn(),
}));

describe('Login Component', () => {
  const mockSignIn = jest.fn();
  const mockSignUp = jest.fn();
  const mockSignInWithGoogle = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Set up mocks
    require('../../firebase/auth').signIn = mockSignIn;
    require('../../firebase/auth').signUp = mockSignUp;
    require('../../firebase/auth').signInWithGoogle = mockSignInWithGoogle;
  });

  describe('Rendering', () => {
    it('renders login form by default', () => {
      render(<Login />);
      
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument(); // Email input
      expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
    });

    it('switches to signup form when signup link is clicked', () => {
      render(<Login />);
      
      const signUpLink = screen.getByRole('button', { name: /sign up$/i });
      fireEvent.click(signUpLink);
      
      expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^sign up$/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('validates email format', () => {
      render(<Login />);
      
      const emailInput = screen.getByRole('textbox');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toBeRequired();
    });

    it('has password input with correct attributes', () => {
      render(<Login />);
      
      const inputs = screen.getAllByDisplayValue('');
      const passwordInput = inputs.find(input => input.getAttribute('type') === 'password');
      
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Form Submission', () => {
    it('submits login form with valid credentials', async () => {
      const mockUser = { uid: '123', email: 'test@example.com' };
      mockSignIn.mockResolvedValue(mockUser);
      
      render(<Login />);
      
      const inputs = screen.getAllByDisplayValue('');
      const emailInput = inputs.find(input => input.getAttribute('type') === 'email');
      const passwordInput = inputs.find(input => input.getAttribute('type') === 'password');
      
      fireEvent.change(emailInput!, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput!, { target: { value: 'password123' } });
      
      const submitButton = screen.getByRole('button', { name: /^login$/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('handles Google sign in', async () => {
      const mockUser = { uid: '789', email: 'google@example.com' };
      mockSignInWithGoogle.mockResolvedValue(mockUser);
      
      render(<Login />);
      
      const googleButton = screen.getByRole('button', { name: /sign in with google/i });
      fireEvent.click(googleButton);
      
      await waitFor(() => {
        expect(mockSignInWithGoogle).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message for failed login', async () => {
      const errorMessage = 'Invalid credentials';
      mockSignIn.mockRejectedValue(new Error(errorMessage));
      
      render(<Login />);
      
      const inputs = screen.getAllByDisplayValue('');
      const emailInput = inputs.find(input => input.getAttribute('type') === 'email');
      const passwordInput = inputs.find(input => input.getAttribute('type') === 'password');
      
      fireEvent.change(emailInput!, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput!, { target: { value: 'wrongpassword' } });
      
      const submitButton = screen.getByRole('button', { name: /^login$/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles', () => {
      render(<Login />);
      
      expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
    });

    it('has proper form structure', () => {
      render(<Login />);
      
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });
});