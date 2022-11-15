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

export const fetchSiteData = createAsyncThunk('ticket/fetchSiteData', async ({ rejectWithValue }) => {
  const fetchSitelist = await makeRequest(`${APIUrlConstants.LIST_SITES}?customerNo=${localStorage.getItem('orgNo')}`);
  if (fetchSitelist[0] === httpStatusCode.SUCCESS) {
    return fetchSitelist;
  }
  return rejectWithValue(fetchSitelist[1]);
});

export const fetchPriorityData = createAsyncThunk('ticket/fetchPriorityData', async ({ rejectWithValue }) => {
  const fetchPriority = await makeRequest(APIUrlConstants.LIST_PRIORITY);
  if (fetchPriority[0] === httpStatusCode.SUCCESS) {
    return fetchPriority;
  }
  return rejectWithValue(fetchPriority[1]);
});

export const fetchProblemData = createAsyncThunk('ticket/fetchProblemData', async ({ rejectWithValue }) => {
  const fetchProblemcode = await makeRequest(APIUrlConstants.LIST_PROBLEM_CODE);
  if (fetchProblemcode[0] === httpStatusCode.SUCCESS) {
    return fetchProblemcode;
  }
  return rejectWithValue(fetchProblemcode[1]);
});

export const fetchSystemData = createAsyncThunk('ticket/fetchSystemData', async ({ rejectWithValue }) => {
  const fetchSystemType = await makeRequest(APIUrlConstants.LIST_SYSTEM_TYPE);
  if (fetchSystemType[0] === httpStatusCode.SUCCESS) {
    return fetchSystemType;
  }
  return rejectWithValue(fetchSystemType[1]);
});

export const fetchTicketData = createAsyncThunk('ticket/fetchTicketData', async (id, { rejectWithValue }) => {
  const fetchTicketView = await makeRequest(`${APIUrlConstants.VIEW_TICKET}/${id}`);
  if (fetchTicketView[0] === httpStatusCode.SUCCESS) {
    return fetchTicketView;
  }
  return rejectWithValue(fetchTicketView[1]);
});

export const ticketsUpdate = createAsyncThunk('ticket/ticketsUpdate', async (ticketObject, { rejectWithValue }) => {
  const { 0: statusCode, 1: data } = await fetchCall(APIUrlConstants.CREATE_TICKET, apiMethods.POST, ticketObject);
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData: data };
  }
  return rejectWithValue(data);
});

export const viewTicket = createAsyncThunk('ticket/viewTicket', async (id, { rejectWithValue }) => {
  const { 0: statusCode, 1: resp } = await makeRequest(`${APIUrlConstants.VIEW_TICKET}/${id}`);
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData: resp };
  }
  return rejectWithValue(resp);
});

export const dashboardData = createAsyncThunk(
  'ticket/dashboardData',
  async ({ url, customerName, customerNumber, type, date }, { rejectWithValue }) => {
    const {
      0: statusCode,
      1: { data },
    } = await makeRequest(`${url}?customerName=${customerName}&customerNumber=${customerNumber}&keyword=${type}&date=${date}`);
    if (statusCode === httpStatusCode.SUCCESS) {
      return { status: statusCode, responseData: data };
    }
    return rejectWithValue(data);
  },
);

export const profileUpdate = createAsyncThunk('ticket/profileUpdate', async (userDetails, { rejectWithValue }) => {
  const { 0: statusCode, 1: data } = await fetchCall(APIUrlConstants.UPDATE_PROFILE, apiMethods.POST, userDetails);
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData: data.data };
  }
  return rejectWithValue(data);
});
