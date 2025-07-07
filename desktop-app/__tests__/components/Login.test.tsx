import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Login from '../../src/components/Login';

// Mock Firebase auth functions
jest.mock('../../src/firebase/auth', () => ({
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
    require('../../src/firebase/auth').signIn = mockSignIn;
    require('../../src/firebase/auth').signUp = mockSignUp;
    require('../../src/firebase/auth').signInWithGoogle = mockSignInWithGoogle;
  });

  describe('Rendering', () => {
    it('renders login form by default', () => {
      render(<Login />);
      
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
    });

    it('switches to signup form when signup link is clicked', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      const signUpLink = screen.getByRole('button', { name: /sign up$/i });
      await user.click(signUpLink);
      
      expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^sign up$/i })).toBeInTheDocument();
    });

    it('switches back to login form when login link is clicked', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      // Switch to signup
      await user.click(screen.getByRole('button', { name: /sign up$/i }));
      
      // Switch back to login
      await user.click(screen.getByRole('button', { name: /login$/i }));
      
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('requires email and password fields', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      const submitButton = screen.getByRole('button', { name: /^login$/i });
      await user.click(submitButton);
      
      expect(mockSignIn).not.toHaveBeenCalled();
    });

    it('validates email format', () => {
      render(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toBeRequired();
    });

    it('validates password field', () => {
      render(<Login />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Form Submission', () => {
    it('submits login form with valid credentials', async () => {
      const user = userEvent.setup();
      const mockUser = { uid: '123', email: 'test@example.com' };
      mockSignIn.mockResolvedValue(mockUser);
      
      render(<Login />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /^login$/i }));
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('submits signup form with valid data', async () => {
      const user = userEvent.setup();
      const mockUser = { uid: '456', email: 'newuser@example.com' };
      mockSignUp.mockResolvedValue(mockUser);
      
      render(<Login />);
      
      // Switch to signup mode
      await user.click(screen.getByRole('button', { name: /sign up$/i }));
      
      await user.type(screen.getByLabelText(/email/i), 'newuser@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /^sign up$/i }));
      
      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith('newuser@example.com', 'password123');
      });
    });

    it('handles Google sign in', async () => {
      const user = userEvent.setup();
      const mockUser = { uid: '789', email: 'google@example.com' };
      mockSignInWithGoogle.mockResolvedValue(mockUser);
      
      render(<Login />);
      
      await user.click(screen.getByRole('button', { name: /sign in with google/i }));
      
      await waitFor(() => {
        expect(mockSignInWithGoogle).toHaveBeenCalled();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading state during form submission', async () => {
      const user = userEvent.setup();
      mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<Login />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /^login$/i }));
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
    });

    it('disables Google button during loading', async () => {
      const user = userEvent.setup();
      mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<Login />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /^login$/i }));
      
      expect(screen.getByRole('button', { name: /sign in with google/i })).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('displays error message for failed login', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Invalid credentials';
      mockSignIn.mockRejectedValue(new Error(errorMessage));
      
      render(<Login />);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /^login$/i }));
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('displays error message for failed signup', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Email already in use';
      mockSignUp.mockRejectedValue(new Error(errorMessage));
      
      render(<Login />);
      
      // Switch to signup
      await user.click(screen.getByRole('button', { name: /sign up$/i }));
      
      await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /^sign up$/i }));
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('displays error message for failed Google sign in', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Popup cancelled by user';
      mockSignInWithGoogle.mockRejectedValue(new Error(errorMessage));
      
      render(<Login />);
      
      await user.click(screen.getByRole('button', { name: /sign in with google/i }));
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('clears error message when switching between forms', async () => {
      const user = userEvent.setup();
      mockSignIn.mockRejectedValue(new Error('Login error'));
      
      render(<Login />);
      
      // Trigger error
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password');
      await user.click(screen.getByRole('button', { name: /^login$/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Login error')).toBeInTheDocument();
      });
      
      // Switch to signup
      await user.click(screen.getByRole('button', { name: /sign up$/i }));
      
      // Error should be cleared
      expect(screen.queryByText('Login error')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(<Login />);
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('has proper button roles', () => {
      render(<Login />);
      
      expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
    });

    it('maintains focus management', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.click(emailInput);
      
      expect(emailInput).toHaveFocus();
    });
  });
});