import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthProvider } from '../context/AuthContext';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Login Page', () => {
  it('renders login form', () => {
    render(<Login />, { wrapper: Wrapper });
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
  });

  it('renders register link', () => {
    render(<Login />, { wrapper: Wrapper });
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('Need an account?')).toBeInTheDocument();
  });

  it('renders passkey button', () => {
    render(<Login />, { wrapper: Wrapper });
    expect(screen.getByText('Log in with a passkey')).toBeInTheDocument();
  });

  it('has email and password input fields', () => {
    render(<Login />, { wrapper: Wrapper });
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('can type into form fields', () => {
    render(<Login />, { wrapper: Wrapper });
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(emailInput).toHaveValue('test@test.com');
    expect(passwordInput).toHaveValue('password123');
  });
});
