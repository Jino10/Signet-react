import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import * as Routers from 'react-router';
import { act } from 'react-dom/test-utils';
import * as fetchAPI from '../../../src/Services/APIService';
import Notification from '../../../src/Pages/Notification/Notification';

const MockNotification = () => {
  return (
    <Router>
      <Notification />
    </Router>
  );
};
const navigate = jest.fn();

describe('Notification page', () => {
  const notificationDetails = [
    200,
    {
      data: {
        content: [
          {
            id: 5847,
            notificationMessage: '<p>qa test</p>\n',
            orgName: 'All',
            createdAt: '2022-10-07T12:04:23.634+00:00',
            seen: true,
          },
          {
            id: 5845,
            notificationMessage: '<p>qa 1</p>\n',
            orgName: 'CapeStart, Inc',
            createdAt: '2022-10-07T11:53:46.582+00:00',
            seen: true,
          },
          {
            id: 5843,
            notificationMessage: '<p>qa 4</p>\n',
            orgName: 'CapeStart, Inc',
            createdAt: '2022-10-07T11:52:09.494+00:00',
            seen: true,
          },
          {
            id: 5841,
            notificationMessage: '<p>qa 2</p>\n',
            orgName: 'CapeStart, Inc',
            createdAt: '2022-10-07T11:51:11.987+00:00',
            seen: true,
          },
          {
            id: 5840,
            notificationMessage: '<p>qa 1</p>\n',
            orgName: 'CapeStart, Inc',
            createdAt: '2022-10-07T11:50:52.880+00:00',
            seen: true,
          },
          {
            id: 5838,
            notificationMessage: '<p>qa test 03</p>\n',
            orgName: 'CapeStart, Inc',
            createdAt: '2022-10-07T11:48:37.938+00:00',
            seen: true,
          },
          {
            id: 5837,
            notificationMessage: '<p>qa test 02</p>\n',
            orgName: 'All',
            createdAt: '2022-10-07T11:48:12.980+00:00',
            seen: true,
          },
          {
            id: 5836,
            notificationMessage: '<p>qa test 01</p>\n',
            orgName: 'CapeStart, Inc',
            createdAt: '2022-10-07T11:47:52.645+00:00',
            seen: true,
          },
          {
            id: 5835,
            notificationMessage: '<p>qa 1</p>\n',
            orgName: 'CapeStart, Inc',
            createdAt: '2022-10-07T11:37:54.246+00:00',
            seen: true,
          },
          {
            id: 5833,
            notificationMessage: '<p>qa 04</p>\n',
            orgName: 'CapeStart, Inc',
            createdAt: '2022-10-07T11:34:21.260+00:00',
            seen: true,
          },
        ],
        pageable: {
          sort: {
            empty: true,
            unsorted: true,
            sorted: false,
          },
          offset: 0,
          pageSize: 10,
          pageNumber: 0,
          paged: true,
          unpaged: false,
        },
        totalPages: 75,
        totalElements: 744,
        last: false,
        number: 0,
        sort: {
          empty: true,
          unsorted: true,
          sorted: false,
        },
        size: 10,
        first: true,
        numberOfElements: 10,
        empty: false,
      },
      status: 'Success',
      message: 'Fetched notification list',
      errorMessage: null,
    },
  ];

  beforeEach(async () => {
    jest.spyOn(Routers, 'useNavigate').mockImplementation(() => navigate);
    localStorage.setItem('id', '3436356354');

    const mockFetchCall = jest.spyOn(fetchAPI, 'fetchCall');
    mockFetchCall.mockResolvedValue(notificationDetails);
    await act(async () => render(<MockNotification />));
  });

  it('should render component', async () => {
    const notifications = screen.getByText(/Notifications/i);
    expect(notifications).toBeInTheDocument();
    expect(screen.getByText('qa test')).toBeInTheDocument();
    const nextBtn = screen.getByText('>');
    const prevBtn = screen.getByText('<');
    expect(nextBtn).toBeInTheDocument();
    expect(prevBtn).toBeInTheDocument();
  });
});
