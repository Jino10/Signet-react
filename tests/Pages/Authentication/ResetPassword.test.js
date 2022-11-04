import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { aboutSignet } from '../../../src/Constants/TextConstants';
import * as Routers from 'react-router';
import { act } from 'react-dom/test-utils';
import * as fetchAPI from '../../../src/Services/APIService';
import { userRoleId } from '../../../src/Utilities/AppUtilities';
import ResetPassword from '../../../src/Pages/Authentication/ResetPassword';

const MockResetPassword = () => {
  return (
    <Router>
      <ResetPassword />
    </Router>
  );
};
const navigate = jest.fn();

describe('GetSSOUserdetails page navigate to login', () => {
  const resetResponse = [
    200,
    {
      data: {
        userId: '00u6nneohcWqOw5tD5d7',
        orgEmail: 'suthen.pg@capestart.com',
        firstName: 'Suthen ',
        lastName: 'PG',
        mobileNumber: null,
        status: 'Active',
        organization: 'CapeStart, Inc',
        roleId: null,
      },
      errorMessage: null,
      message: 'Password reset successful',
      status: 'Success',
    },
  ];

  beforeEach(async () => {
    jest.spyOn(Routers, 'useNavigate').mockImplementation(() => navigate);
    localStorage.setItem('restPasswordUserId', '00u6nneohcWqOw5tD5d7');
    const mockFetchCall = jest.spyOn(fetchAPI, 'fetchCall');
    mockFetchCall.mockResolvedValue(resetResponse);
    await act(async () => render(<MockResetPassword />));
  });

  it('should render all inputs, texts, buttons and links', async () => {
    const reset = screen.getByText(/Reset/i);
    expect(reset).toBeInTheDocument();
    const yourPassword = screen.getByText(/Your Password/i);
    expect(yourPassword).toBeInTheDocument();
    expect(screen.getByText(aboutSignet)).toBeInTheDocument();
    const enterPassword = screen.getByText(/Please enter your new password below/i);
    expect(enterPassword).toBeInTheDocument();
    const clickHere = screen.getByText(/Click here to/i);
    expect(clickHere).toBeInTheDocument();

    const loginLink = screen.getByRole('link', { name: 'Login' });
    expect(loginLink).toHaveAttribute('href', 'https://signet.test-app.link/');

    const newPassword = screen.getByPlaceholderText('New password');
    const confirmPassword = screen.getByPlaceholderText('Confirm password');
    expect(newPassword).toBeInTheDocument();
    expect(confirmPassword).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveAttribute('disabled');

    expect(
      screen.getByText(
        'The password entered is not strong, Please enter a strong password with minimum 8 characters, a capital letter and a special character',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Password did not match/i)).toBeInTheDocument();
  });

  it('New password input should change', async () => {
    const newPassword = screen.getByPlaceholderText('New password');
    fireEvent.change(newPassword, { target: { value: 'abcde' } });
    expect(newPassword.value).toBe('abcde');
  });
  it('Confirm password input should change', async () => {
    const confirmPassword = screen.getByPlaceholderText('Confirm password');
    fireEvent.change(confirmPassword, { target: { value: 'abcde' } });
    expect(confirmPassword.value).toBe('abcde');
  });
  it('password submit', async () => {
    const newPassword = screen.getByPlaceholderText('New password');
    fireEvent.change(newPassword, { target: { value: 'CApe_123' } });
    const confirmPassword = screen.getByPlaceholderText('Confirm password');
    fireEvent.change(confirmPassword, { target: { value: 'CApe_123' } });
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    expect(submitBtn).not.toHaveAttribute('disabled');
    userEvent.click(submitBtn);
  });
});
