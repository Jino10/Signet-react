import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import * as fetchAPI from '../../../src/Services/APIService';
import APIUrlConstants from '../../../src/Config/APIUrlConstants';
import { apiMethods } from '../../../src/Constants/TextConstants';
import ForgetPassword from '../../../src/Pages/Authentication/ForgetPassword';

const MockForgetPassword = () => {
  return (
    <Router>
      <ForgetPassword />
    </Router>
  );
};

describe('Forget password page', () => {
  beforeEach(() => {
    render(<MockForgetPassword />);
  });

  it('should render component', async () => {
    const emailInput = screen.getByPlaceholderText(/Email/i);

    expect(emailInput).toBeInTheDocument();
  });

  it('should render all inputs, submit button, text and links', async () => {
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    const loginLink = screen.getByRole('link', { name: 'Login' });

    expect(emailInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(loginLink).toHaveAttribute('href', '/');
  });

  it('email input should change', async () => {
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'abcde.f@capestart.com' } });
    expect(emailInput.value).toBe('abcde.f@capestart.com');
  });

  it('should be failed on email', async () => {
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    expect(emailInput.value).toBe('');
    userEvent.click(submitButton);
    expect(await screen.findByText('Please provide a valid email')).toBeVisible();
  });

  it('should be failed on email validation', async () => {
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    userEvent.type(emailInput, 'srinu.v');
    userEvent.click(submitButton);
    expect(emailInput.value).not.toMatch('abcde.f@capestart.com');
    expect(await screen.findByText('Please provide a valid email')).toBeVisible();
  });

  it('should fail mock api test', async () => {
    const wrongPassord = [
      400,
      {
        data: null,
        status: 'Fail',
        message: 'The email is not registered',
        errorMessage: null,
      },
    ];

    const mockFetchCall = jest.spyOn(fetchAPI, 'fetchCall');
    mockFetchCall.mockResolvedValue(wrongPassord);

    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(emailInput, '11.f@11.com');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('The email is not registered')).toBeVisible();
    });
  });

  it('should not show errors', async () => {
    const correctPassord = [
      200,
      {
        data: 'srinu.v@capestart.com',
        status: 'Success',
        message: 'srinu.v@capestart.com',
        errorMessage: null,
      },
    ];

    const mockFetchCall = jest.spyOn(fetchAPI, 'fetchCall');
    mockFetchCall.mockResolvedValue(correctPassord);

    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    userEvent.type(emailInput, 'srinu.v@capestart.com');
    userEvent.click(submitButton);

    const urlencoded = new URLSearchParams();
    const { 0: statuscode, 1: data } = await fetchAPI.fetchCall(
      `${APIUrlConstants.FORGETPASSWORDAPI}?email=srinu.v@capestart.com`,
      apiMethods.POST,
      urlencoded,
    );
    await waitFor(() => {
      expect(screen.getByText('Please check the reset password link sent to your registered email.')).toBeVisible();
    });
  });
});
