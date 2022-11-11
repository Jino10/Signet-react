import { createAsyncThunk } from '@reduxjs/toolkit';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { makeRequest, fetchCall } from '../../Services/APIService';
import { apiMethods, httpStatusCode } from '../../Constants/TextConstants';

export const userAllTickets = createAsyncThunk('ticket/userAllTickets', async (arg, { rejectWithValue }) => {
  const { 0: statusCode, 1: data } = await makeRequest(
    APIUrlConstants.TICKETS_LIST + `?customerNo=${localStorage.getItem('orgNo')}`,
  );
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData: data.data };
  }
  return rejectWithValue(data);
});

export const fetchSiteData = createAsyncThunk('ticket/fetchSiteData', async () => {
  const fetchSitelist = await makeRequest(`${APIUrlConstants.LIST_SITES}?customerNo=${localStorage.getItem('orgNo')}`);
  return fetchSitelist;
});

export const fetchPriorityData = createAsyncThunk('ticket/fetchPriorityData', async () => {
  const fetchPriority = await makeRequest(APIUrlConstants.LIST_PRIORITY);
  return fetchPriority;
});

export const fetchProblemData = createAsyncThunk('ticket/fetchProblemData', async () => {
  const fetchProblemcode = await makeRequest(APIUrlConstants.LIST_PROBLEM_CODE);
  return fetchProblemcode;
});

export const fetchSystemData = createAsyncThunk('ticket/fetchSystemData', async () => {
  const fetchSystemType = await makeRequest(APIUrlConstants.LIST_SYSTEM_TYPE);
  return fetchSystemType;
});

export const fetchTicketData = createAsyncThunk('ticket/fetchTicketData', async (id) => {
  const fetchTicketView = await makeRequest(`${APIUrlConstants.VIEW_TICKET}/${id}`);
  return fetchTicketView;
});

export const ticketsUpdate = createAsyncThunk('ticket/ticketsUpdate', async (ticketObject, { rejectWithValue }) => {
  const { 0: statusCode, 1: data } = await fetchCall(APIUrlConstants.CREATE_TICKET, apiMethods.POST, ticketObject);
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData: data };
  }
  return rejectWithValue(data);
});

export const viewTicket = createAsyncThunk('ticket/viewTicket', async (id) => {
  const { 0: statusCode, 1: resp } = await makeRequest(`${APIUrlConstants.VIEW_TICKET}/${id}`);
  return { status: statusCode, responseData: resp };
});

export const dashboardData = createAsyncThunk(
  'ticket/dashboardData',
  async ({ url, customerName, customerNumber, type, date }) => {
    const {
      0: statusCode,
      1: { data },
    } = await makeRequest(`${url}?customerName=${customerName}&customerNumber=${customerNumber}&keyword=${type}&date=${date}`);
    return { status: statusCode, responseData: data };
  },
);

export const profileUpdate = createAsyncThunk('ticket/profileUpdate', async (userDetails, { rejectWithValue }) => {
  const { 0: statusCode, 1: data } = await fetchCall(APIUrlConstants.UPDATE_PROFILE, apiMethods.POST, userDetails);
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData: data.data };
  }
  return rejectWithValue(data);
});
