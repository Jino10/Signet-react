import APIUrlConstants from '../../Config/APIUrlConstants';
import { fetchCall, makeRequest } from '../../Services/APIService';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiMethods, httpStatusCode } from '../../Constants/TextConstants';

export const userLogin = createAsyncThunk('session/userLogin', async (urlencoded, { rejectWithValue }) => {
  const { 0: statuscode, 1: data } = await fetchCall(APIUrlConstants.LOGIN_API, apiMethods.POST, urlencoded);
  if (statuscode === httpStatusCode.SUCCESS) {
    return { status: statuscode, responseData: data.data };
  }
  return rejectWithValue(data);
});

export const twoFactorLogin = createAsyncThunk('session/twoFactorLogin', async ({ id, otp }, { rejectWithValue }) => {
  const { 0: statuscode, 1: data } = await fetchCall(
    APIUrlConstants.LOGIN_OTP_API + '?id=' + id + '&otp=' + otp,
    apiMethods.POST,
  );
  if (statuscode === httpStatusCode.SUCCESS) {
    return { status: statuscode, responseData: data.data };
  }
  return rejectWithValue(data);
});

export const resendOTP = createAsyncThunk('session/resendOTP', async (id, { rejectWithValue }) => {
  const [statusCode, response] = await fetchCall(`${APIUrlConstants.RESEND_OTP_EMAIL}/${id}`, apiMethods.POST);
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData: response };
  }
  return rejectWithValue(response);
});

export const userLogout = createAsyncThunk('session/userLogout', async (urlencoded, { rejectWithValue }) => {
  const [statusCode, response] = await fetchCall(APIUrlConstants.LOGOUT_API, apiMethods.POST, urlencoded);
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData: response };
  }
  return rejectWithValue(response);
});

export const chartData = createAsyncThunk('ticket/chartData', async () => {
  const [statusCode] = await fetchCall(`${APIUrlConstants.CONTACT_SALES}/${localStorage.getItem('id')}`, apiMethods.POST, {});
  return { status: statusCode };
});

export const signUpAccount = createAsyncThunk(
  'session/signUpAccount',
  async ({ firstName, lastName, organization, orgEmail, password, phone }, { rejectWithValue }) => {
    const { 0: statusCode, 1: responseData } = await fetchCall(APIUrlConstants.REGISTRATION, apiMethods.POST, {
      firstName,
      lastName,
      orgName: organization,
      orgEmail,
      password,
      primaryPhone: phone,
      isMobileVerify: true,
    });
    if (statusCode === httpStatusCode.SUCCESS) {
      return { status: statusCode, responseData };
    }
    return rejectWithValue(responseData);
  },
);

export const forgetData = createAsyncThunk('session/forgetData', async (stateData, { rejectWithValue }) => {
  const { 0: statusCode, 1: responseData } = await fetchCall(
    APIUrlConstants.FORGET_PASSWORD_API + stateData.email,
    apiMethods.POST,
  );
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData };
  }
  return rejectWithValue(responseData);
});

export const getSSOUser = createAsyncThunk('session/getSSOUser', async (getUser, { rejectWithValue }) => {
  const { 0: status, 1: responseData } = await fetchCall(APIUrlConstants.GET_SSO_USER_DETAILS, apiMethods.POST);
  if (status === httpStatusCode.SUCCESS) {
    return { status, responseData };
  }
  return rejectWithValue(responseData);
});

export const updateSSOUser = createAsyncThunk('session/updateSSOUser', async (user, { rejectWithValue }) => {
  const { 0: statusCode, 1: responseData } = await fetchCall(APIUrlConstants.CREATE_USER_WITH_ORG, apiMethods.POST, user);
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData };
  }
  return rejectWithValue(responseData);
});

export const updatePhone = createAsyncThunk('session/updatePhone', async (sendingdata, { rejectWithValue }) => {
  const response = await fetchCall(APIUrlConstants.UPDATE_PROFILE, apiMethods.POST, sendingdata);
  if (response[0] === httpStatusCode.SUCCESS) {
    return { responseData: response };
  }
  return rejectWithValue(response[1]);
});

export const resetData = createAsyncThunk('session/resetData', async (data, { rejectWithValue }) => {
  const { 0: statusCode, 1: responseData } = await fetchCall(APIUrlConstants.RESET_PASSWORD_API, apiMethods.POST, data);
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData };
  }
  return rejectWithValue(responseData);
});

export const successData = createAsyncThunk('session/successData', async (name, { rejectWithValue }) => {
  const response = await makeRequest(
    `${APIUrlConstants.APPROVAL_REQUEST_API}/${localStorage.getItem('verifyUserId')}?name=${name}`,
    {},
  );
  if (response[0] === httpStatusCode.SUCCESS) {
    return { responseData: response };
  }
  return rejectWithValue(response[1]);
});

export const notificationData = createAsyncThunk(
  'session/notificationData',
  async ({ pageNo, organizationName }, { rejectWithValue }) => {
    const [statusCode, response] = await fetchCall(APIUrlConstants.VIEW_ALL_NOTIFICATIONS, apiMethods.POST, {
      userId: localStorage.getItem('id'),
      orgName: organizationName,
      page: pageNo,
      pageSize: 10,
      status: 'All',
    });
    if (statusCode === httpStatusCode.SUCCESS) {
      return { status: statusCode, responseData: response };
    }
    return rejectWithValue(response);
  },
);

export const fetchNotifyData = createAsyncThunk('session/fetchNotifyData', async (organizationName, { rejectWithValue }) => {
  const [statusCode, response] = await fetchCall(APIUrlConstants.LIST_NOTIFICATIONS, apiMethods.POST, {
    userId: localStorage.getItem('id'),
    orgName: organizationName,
  });
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData: response };
  }
  return rejectWithValue(response);
});

export const removeNotifyData = createAsyncThunk('session/removeNotifyData', async (ids, { rejectWithValue }) => {
  const { 0: statuscode, 1: data } = await fetchCall(APIUrlConstants.REMOVE_NOTIFICATIONS, apiMethods.POST, {
    userId: localStorage.getItem('id'),
    notificationIds: ids,
  });
  if (statuscode === httpStatusCode.SUCCESS) {
    return { status: statuscode, responseData: data };
  }
  return rejectWithValue(data);
});

export const removeData = createAsyncThunk('session/removeData', async (liveNotification, { rejectWithValue }) => {
  const { 0: statusCode, 1: data } = await fetchCall(APIUrlConstants.REMOVE_NOTIFICATIONS, apiMethods.POST, {
    userId: localStorage.getItem('id'),
    notificationIds: [liveNotification[0].id],
  });
  if (statusCode === httpStatusCode.SUCCESS) {
    return { status: statusCode, responseData: data };
  }
  return rejectWithValue(data);
});
