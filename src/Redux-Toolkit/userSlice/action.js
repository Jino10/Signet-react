import { makeRequest, fetchCall } from '../../Services/APIService';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { apiMethods, httpStatusCode } from '../../Constants/TextConstants';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const allUsersList = createAsyncThunk('user/allUsersList', async (val, { rejectWithValue }) => {
  const { 0: statusCode, 1: data } = await makeRequest(APIUrlConstants.FETCH_USER_DETAILS);
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData: data.data };
  }
  return rejectWithValue(data);
});

export const deleteUserId = createAsyncThunk('user/deleteUserId', async ({ id, dUser }, { rejectWithValue }) => {
  const { 0: statusCode, 1: responseData } = await fetchCall(`${APIUrlConstants.DELETE_USER}/${id}`, apiMethods.DELETE, dUser);
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData };
  }
  return rejectWithValue(responseData);
});

export const userDetails = createAsyncThunk('user/userDetails', async (userId, { rejectWithValue }) => {
  const { 0: status, 1: data } = await makeRequest(`${APIUrlConstants.GET_USER_DETAILS}/${userId}`);
  if (status === httpStatusCode.SUCCESS) {
    return { status, responseData: data.data };
  }
  return rejectWithValue(data);
});

export const fetchUserRole = createAsyncThunk('user/fetchUserRole', async ({ rejectWithValue }) => {
  const { 0: status, 1: res } = await makeRequest(APIUrlConstants.GET_USER_ROLES);
  if (status === httpStatusCode.SUCCESS) {
    return { status, responseData: res.data };
  }
  return rejectWithValue(res);
});

export const fetchOrg = createAsyncThunk('user/fetchOrg', async (searchtext, { rejectWithValue }) => {
  const response = await makeRequest(`${APIUrlConstants.SEARCH_ORG}?company=${searchtext}`);
  if (response[0] === httpStatusCode.SUCCESS) {
    return { responseData: response };
  }
  return rejectWithValue(response[1]);
});

export const createUser = createAsyncThunk('user/createUser', async ({ endPoint, user }, { rejectWithValue }) => {
  const { 0: statusCode, 1: responseData } = await fetchCall(endPoint, apiMethods.POST, user);
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData };
  }
  return rejectWithValue(responseData);
});

export const fetchOrgNames = createAsyncThunk('user/fetchOrgName', async (searchtext, { rejectWithValue }) => {
  const response = await makeRequest(`${APIUrlConstants.GET_ORG_NAME}?orgName=${searchtext}`);
  if (response[0] === httpStatusCode.SUCCESS) {
    return { responseData: response };
  }
  return rejectWithValue(response[1]);
});

export const fullUserDetails = createAsyncThunk('user/fullUserDetails', async (id, { rejectWithValue }) => {
  const {
    0: statusCode,
    1: { data },
  } = await makeRequest(`${APIUrlConstants.GET_USER_DETAILS}/${id}`);
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData: data };
  }
  return rejectWithValue(data);
});

export const updateUserData = createAsyncThunk('user/updateUserData', async (user, { rejectWithValue }) => {
  const { 0: status, 1: data } = await fetchCall(APIUrlConstants.UPDATE_USER_DETAILS, apiMethods.PUT, user);
  if (status === httpStatusCode.SUCCESS) {
    return { status, responseData: data };
  }
  return rejectWithValue(data);
});

export const postData = createAsyncThunk('user/postData', async ({ optionval, msg, search, message }, { rejectWithValue }) => {
  const response = await fetchCall(APIUrlConstants.POST_NOTIFICATION_API, apiMethods.POST, {
    alertMessage: optionval === 'all' ? msg : message,
    orgName: optionval === 'all' ? 'All' : search,
  });
  if (response[0] === httpStatusCode.SUCCESS) {
    return { responseData: response };
  }
  return rejectWithValue(response[1]);
});
