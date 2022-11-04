import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { aboutSignet } from '../../../src/Constants/TextConstants';
import GetSSOUserdetails from '../../../src/Pages/Authentication/GetSSOUserdetails';
import * as Routers from 'react-router';
import { act } from 'react-dom/test-utils';
import * as fetchAPI from '../../../src/Services/APIService';
import { userRoleId } from '../../../src/Utilities/AppUtilities';

const MockGetSSOUserdetails = () => {
  return (
    <Router>
      <GetSSOUserdetails />
    </Router>
  );
};
const navigate = jest.fn();
describe('GetSSOUserdetails page', () => {
  const userDetails = [
    200,
    {
      data: {
        firstName: 'Suthen ',
        lastName: 'PG\t',
        userId: '00u6nmsdhbyjSFmqQ5d7',
        email: null,
        orgEmail: 'suthen.pg@capestart.com',
        orgName: null,
        mobileNumber: null,
        valid: false,
      },
      status: 'Success',
      message: 'Updated successfully',
      errorMessage: null,
    },
  ];

  beforeEach(async () => {
    jest.spyOn(Routers, 'useNavigate').mockImplementation(() => navigate);
    localStorage.setItem(
      'temp_token',
      'eyJraWQiOiIyMDBUNkdqNXpJOVZkSFBiMTNxREdCem1fbUM2dU02a1hlVDNLdl9oRGNzIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULkF1M0x0eGRCazBuOTQtTmNhUnhtRHZha1hYQmFtNFRQT2xIbXVtNDkyRnMiLCJpc3MiOiJodHRwczovL2Rldi05NjkyNTcwLm9rdGEuY29tL29hdXRoMi9hdXM1YTEzam8yOGoxYjZNNDVkNyIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2NjQyNTA3ODcsImV4cCI6MTY2NDI1NDM4NywiY2lkIjoiMG9hNWEwaWpnOFpwaEZvWWs1ZDciLCJ1aWQiOiIwMHU2bm1zZGhieWpTRm1xUTVkNyIsInNjcCI6WyJwcm9maWxlIiwib3BlbmlkIl0sImF1dGhfdGltZSI6MTY2NDI1MDc4Niwic3ViIjoic3V0aGVuLnBnQGNhcGVzdGFydC5jb20iLCJmaXJzdE5hbWUiOiJTdXRoZW4gIiwibGFzdE5hbWUiOiJQR1x0IiwiZ3JvdXBzIjpbIkV2ZXJ5b25lIl0sImVtYWlsIjoic3V0aGVuLnBnQGNhcGVzdGFydC5jb20ifQ.iDwIzcrVNLlQb65hI4wtQDQC6G-GI5ax-Ruq3FD6OUmVPGKgjyf5VcURNB8oL182hyfEvJPrXUzChaTShNMdOOEe1gDbRN_vq61v4vrtTDLz91kX0-FnmE63k4hh8Cbx0dhsV45z1yzm35W9reP3w4QQXyV8wixtjl3I3iJvsGggjF7pGLw1f16IIS-nWTUvqyQ_1Fd1vJQTExdZg95Ywu2r2f0gZSm0s1cRQpfcd_jThNQAXZlFJOV5IcSyq-rEIPqtc6ivTcZQmrPtaMkUWdYIf1vPkNJqdGjgjLUR-qHvjMf0dqwy1j5Uyu-u407YgSP_QVcv1GEeNARWOPzadQ',
    );
    const mockFetchCall = jest.spyOn(fetchAPI, 'fetchCall');
    mockFetchCall.mockResolvedValue(userDetails);
    await act(async () => render(<MockGetSSOUserdetails />));
  });

  it('should render component', async () => {
    const enterDetails = screen.getByText(/Enter Details/i);
    expect(enterDetails).toBeInTheDocument();
  });

  it('should render all inputs, buttons and links', async () => {
    const orgNameInput = screen.getByPlaceholderText('Organization');
    const phoneNoInput = screen.getByPlaceholderText('Phone Number');
    const verifyBtn = screen.getByTestId('verifybtn');
    const termsInput = screen.getByTestId('termsCheckbox');

    expect(orgNameInput).toBeInTheDocument();
    expect(phoneNoInput).toBeInTheDocument();
    expect(verifyBtn).toBeInTheDocument();
    expect(termsInput).toBeInTheDocument();

    const termsLabel = screen.getByLabelText(/Agree to/i);
    const termsLink = screen.getByText('terms and conditions');
    expect(termsLabel).toBeInTheDocument();
    expect(termsLink).toHaveAttribute('href', '/termsandconditions');

    const updateBtn = screen.getByText('Update');
    expect(updateBtn).toBeInTheDocument();
  });

  it('should render all texts', async () => {
    const enterDetails = screen.getByText(/Enter Details/i);
    expect(enterDetails).toBeInTheDocument();
    expect(screen.getByText(aboutSignet)).toBeInTheDocument();
  });

  it('terms checkbox input should change', async () => {
    const termsInput = screen.getByTestId('termsCheckbox');
    expect(termsInput.checked).toEqual(false);
    userEvent.click(termsInput);
    expect(termsInput.checked).toEqual(true);
  });

  it('should be failed on validation', async () => {
    const verifyBtn = screen.getByTestId('verifybtn');
    userEvent.click(verifyBtn);
    expect(screen.getByText('Organization is required')).toBeVisible();
    expect(screen.getByText('Enter a valid Phone Number')).toBeVisible();
    expect(screen.getByText('Please agree to terms and conditions')).toBeVisible();
  });
});

describe('GetSSOUserdetails page without Last name', () => {
  const userDetails = [
    200,
    {
      data: {
        firstName: 'Suthen ',
        lastName: null,
        userId: '00u6nmsdhbyjSFmqQ5d7',
        email: null,
        orgEmail: 'suthen.pg@capestart.com',
        orgName: null,
        mobileNumber: null,
        valid: false,
      },
      status: 'Success',
      message: 'Updated successfully',
      errorMessage: null,
    },
  ];

  beforeEach(async () => {
    jest.spyOn(Routers, 'useNavigate').mockImplementation(() => navigate);
    localStorage.setItem(
      'temp_token',
      'eyJraWQiOiIyMDBUNkdqNXpJOVZkSFBiMTNxREdCem1fbUM2dU02a1hlVDNLdl9oRGNzIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULkF1M0x0eGRCazBuOTQtTmNhUnhtRHZha1hYQmFtNFRQT2xIbXVtNDkyRnMiLCJpc3MiOiJodHRwczovL2Rldi05NjkyNTcwLm9rdGEuY29tL29hdXRoMi9hdXM1YTEzam8yOGoxYjZNNDVkNyIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2NjQyNTA3ODcsImV4cCI6MTY2NDI1NDM4NywiY2lkIjoiMG9hNWEwaWpnOFpwaEZvWWs1ZDciLCJ1aWQiOiIwMHU2bm1zZGhieWpTRm1xUTVkNyIsInNjcCI6WyJwcm9maWxlIiwib3BlbmlkIl0sImF1dGhfdGltZSI6MTY2NDI1MDc4Niwic3ViIjoic3V0aGVuLnBnQGNhcGVzdGFydC5jb20iLCJmaXJzdE5hbWUiOiJTdXRoZW4gIiwibGFzdE5hbWUiOiJQR1x0IiwiZ3JvdXBzIjpbIkV2ZXJ5b25lIl0sImVtYWlsIjoic3V0aGVuLnBnQGNhcGVzdGFydC5jb20ifQ.iDwIzcrVNLlQb65hI4wtQDQC6G-GI5ax-Ruq3FD6OUmVPGKgjyf5VcURNB8oL182hyfEvJPrXUzChaTShNMdOOEe1gDbRN_vq61v4vrtTDLz91kX0-FnmE63k4hh8Cbx0dhsV45z1yzm35W9reP3w4QQXyV8wixtjl3I3iJvsGggjF7pGLw1f16IIS-nWTUvqyQ_1Fd1vJQTExdZg95Ywu2r2f0gZSm0s1cRQpfcd_jThNQAXZlFJOV5IcSyq-rEIPqtc6ivTcZQmrPtaMkUWdYIf1vPkNJqdGjgjLUR-qHvjMf0dqwy1j5Uyu-u407YgSP_QVcv1GEeNARWOPzadQ',
    );
    const mockFetchCall = jest.spyOn(fetchAPI, 'fetchCall');
    mockFetchCall.mockResolvedValue(userDetails);
    await act(async () => render(<MockGetSSOUserdetails />));
  });

  it('should render last name input', async () => {
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    expect(lastNameInput).toBeInTheDocument();
  });
});

describe('GetSSOUserdetails page without roleId', () => {
  const userDetails = [
    200,
    {
      data: {
        firstName: 'Suthen ',
        lastName: 'PG\t',
        userId: '00u6nmsdhbyjSFmqQ5d7',
        email: 'suthen.pg@capestart.com',
        orgEmail: 'suthen.pg@capestart.com',
        orgName: 'CapeStart, Inc',
        mobileNumber: 9876543210,
        valid: false,
        roleId: userRoleId.signetAdmin,
        isSocial: true,
        orgNo: 'CAI001',
        probe: null,
        isContactSales: false,
      },
      status: 'Success',
      message: 'Updated successfully',
      errorMessage: null,
    },
  ];

  beforeEach(async () => {
    jest.spyOn(Routers, 'useNavigate').mockImplementation(() => navigate);
    localStorage.setItem(
      'temp_token',
      'eyJraWQiOiIyMDBUNkdqNXpJOVZkSFBiMTNxREdCem1fbUM2dU02a1hlVDNLdl9oRGNzIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULkF1M0x0eGRCazBuOTQtTmNhUnhtRHZha1hYQmFtNFRQT2xIbXVtNDkyRnMiLCJpc3MiOiJodHRwczovL2Rldi05NjkyNTcwLm9rdGEuY29tL29hdXRoMi9hdXM1YTEzam8yOGoxYjZNNDVkNyIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2NjQyNTA3ODcsImV4cCI6MTY2NDI1NDM4NywiY2lkIjoiMG9hNWEwaWpnOFpwaEZvWWs1ZDciLCJ1aWQiOiIwMHU2bm1zZGhieWpTRm1xUTVkNyIsInNjcCI6WyJwcm9maWxlIiwib3BlbmlkIl0sImF1dGhfdGltZSI6MTY2NDI1MDc4Niwic3ViIjoic3V0aGVuLnBnQGNhcGVzdGFydC5jb20iLCJmaXJzdE5hbWUiOiJTdXRoZW4gIiwibGFzdE5hbWUiOiJQR1x0IiwiZ3JvdXBzIjpbIkV2ZXJ5b25lIl0sImVtYWlsIjoic3V0aGVuLnBnQGNhcGVzdGFydC5jb20ifQ.iDwIzcrVNLlQb65hI4wtQDQC6G-GI5ax-Ruq3FD6OUmVPGKgjyf5VcURNB8oL182hyfEvJPrXUzChaTShNMdOOEe1gDbRN_vq61v4vrtTDLz91kX0-FnmE63k4hh8Cbx0dhsV45z1yzm35W9reP3w4QQXyV8wixtjl3I3iJvsGggjF7pGLw1f16IIS-nWTUvqyQ_1Fd1vJQTExdZg95Ywu2r2f0gZSm0s1cRQpfcd_jThNQAXZlFJOV5IcSyq-rEIPqtc6ivTcZQmrPtaMkUWdYIf1vPkNJqdGjgjLUR-qHvjMf0dqwy1j5Uyu-u407YgSP_QVcv1GEeNARWOPzadQ',
    );
    const mockFetchCall = jest.spyOn(fetchAPI, 'fetchCall');
    mockFetchCall.mockResolvedValue(userDetails);
    await act(async () => render(<MockGetSSOUserdetails />));
  });

  it('should navigate to users', async () => {
    expect(navigate).toHaveBeenCalledWith('/users');
  });
});
describe('GetSSOUserdetails page navigate to login', () => {
  const userDetails = [
    400,
    {
      data: {
        firstName: 'Suthen ',
        lastName: 'PG\t',
        userId: '00u6nmsdhbyjSFmqQ5d7',
        email: 'suthen.pg@capestart.com',
        orgEmail: 'suthen.pg@capestart.com',
        orgName: 'CapeStart, Inc',
        mobileNumber: 9876543210,
        valid: false,
        roleId: userRoleId.signetAdmin,
        isSocial: true,
        orgNo: 'CAI001',
        probe: null,
        isContactSales: false,
      },
      status: 'Success',
      message: `You can't sign in here with a personal account. Use your work or school account instead.`,
      errorMessage: null,
    },
  ];

  beforeEach(async () => {
    jest.spyOn(Routers, 'useNavigate').mockImplementation(() => navigate);
    localStorage.setItem(
      'temp_token',
      'eyJraWQiOiIyMDBUNkdqNXpJOVZkSFBiMTNxREdCem1fbUM2dU02a1hlVDNLdl9oRGNzIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULkF1M0x0eGRCazBuOTQtTmNhUnhtRHZha1hYQmFtNFRQT2xIbXVtNDkyRnMiLCJpc3MiOiJodHRwczovL2Rldi05NjkyNTcwLm9rdGEuY29tL29hdXRoMi9hdXM1YTEzam8yOGoxYjZNNDVkNyIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2NjQyNTA3ODcsImV4cCI6MTY2NDI1NDM4NywiY2lkIjoiMG9hNWEwaWpnOFpwaEZvWWs1ZDciLCJ1aWQiOiIwMHU2bm1zZGhieWpTRm1xUTVkNyIsInNjcCI6WyJwcm9maWxlIiwib3BlbmlkIl0sImF1dGhfdGltZSI6MTY2NDI1MDc4Niwic3ViIjoic3V0aGVuLnBnQGNhcGVzdGFydC5jb20iLCJmaXJzdE5hbWUiOiJTdXRoZW4gIiwibGFzdE5hbWUiOiJQR1x0IiwiZ3JvdXBzIjpbIkV2ZXJ5b25lIl0sImVtYWlsIjoic3V0aGVuLnBnQGNhcGVzdGFydC5jb20ifQ.iDwIzcrVNLlQb65hI4wtQDQC6G-GI5ax-Ruq3FD6OUmVPGKgjyf5VcURNB8oL182hyfEvJPrXUzChaTShNMdOOEe1gDbRN_vq61v4vrtTDLz91kX0-FnmE63k4hh8Cbx0dhsV45z1yzm35W9reP3w4QQXyV8wixtjl3I3iJvsGggjF7pGLw1f16IIS-nWTUvqyQ_1Fd1vJQTExdZg95Ywu2r2f0gZSm0s1cRQpfcd_jThNQAXZlFJOV5IcSyq-rEIPqtc6ivTcZQmrPtaMkUWdYIf1vPkNJqdGjgjLUR-qHvjMf0dqwy1j5Uyu-u407YgSP_QVcv1GEeNARWOPzadQ',
    );
    const mockFetchCall = jest.spyOn(fetchAPI, 'fetchCall');
    mockFetchCall.mockResolvedValue(userDetails);
    await act(async () => render(<MockGetSSOUserdetails />));
  });

  it('should navigate to login', async () => {
    expect(navigate).toHaveBeenCalledWith('/');
  });
});
