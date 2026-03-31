import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../pages/Register';
import { AuthProvider } from '../context/AuthContext';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Register Page', () => {
  it('renders register form', () => {
    render(<Register />, { wrapper: Wrapper });
    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('renders optional fields', () => {
    render(<Register />, { wrapper: Wrapper });
    expect(screen.getByText('Display Name')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('renders date of birth dropdowns', () => {
    render(<Register />, { wrapper: Wrapper });
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
  });

  it('renders terms checkbox', () => {
    render(<Register />, { wrapper: Wrapper });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders login link', () => {
    render(<Register />, { wrapper: Wrapper });
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
  });

  it('password and confirm password fields exist', () => {
    render(<Register />, { wrapper: Wrapper });
    const password = screen.getByLabelText('Password');
    const confirm = screen.getByLabelText('Confirm Password');
    expect(password).toHaveAttribute('type', 'password');
    expect(confirm).toHaveAttribute('type', 'password');
  });
});
