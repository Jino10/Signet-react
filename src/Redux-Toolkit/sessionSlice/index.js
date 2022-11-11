import { createSlice } from '@reduxjs/toolkit';
import {
  userLogin,
  twoFactorLogin,
  resendOTP,
  userLogout,
  chartData,
  signUpAccount,
  forgetData,
  getSSOUser,
  updateSSOUser,
  updatePhone,
  resetData,
  successData,
  notificationData,
  fetchNotifyData,
} from './action';

const initialState = {
  apiStatus: null,
  apiFullStatus: null,
  notifyStatus: null,
  ssoUserStatus: null,
  listNotifyStatus: null,
  loading: false,
  isFetching: false,
  isError: false,
  error: null,
  userData: [],
  signUpData: [],
  forgetPass: [],
  ssoUserData: [],
  updateSSOData: [],
  updateNumberData: [],
  resetPass: [],
  successValue: [],
  notificationValues: [],
  listNotifyData: [],
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    /* eslint no-param-reassign:"error" */
    setLogin: (state) => {
      state.userData = null;
      state.loading = false;
      state.apiStatus = null;
      state.listNotifyData = null;
    },
    setDefaultStatus: (state) => {
      state.apiStatus = null;
      state.notifyStatus = null;
      state.ssoUserStatus = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.isError = false;
      state.userData = action.payload.responseData;
      state.apiStatus = action.payload.status;
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      state.loading = false;
      state.userData = null;
      state.apiStatus = false;
      state.error = action.payload.message;
    });
    builder.addCase(twoFactorLogin.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(twoFactorLogin.fulfilled, (state, action) => {
      state.apiFullStatus = action.payload.status;
      state.isFetching = false;
      state.loading = false;
      state.isError = false;
      state.userData = action.payload.responseData;
    });
    builder.addCase(twoFactorLogin.rejected, (state, action) => {
      state.loading = false;
      state.apiFullStatus = false;
      state.error = action.payload.message;
    });
    builder.addCase(resendOTP.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(resendOTP.fulfilled, (state, action) => {
      state.apiStatus = action.payload.status;
      state.isFetching = false;
      state.loading = false;
      state.isError = false;
    });
    builder.addCase(resendOTP.rejected, (state) => {
      state.loading = false;
      state.apiStatus = false;
    });
    builder.addCase(userLogout.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(userLogout.fulfilled, (state, action) => {
      state.apiStatus = action.payload.status;
      state.loading = false;
      state.isFetching = false;
    });
    builder.addCase(userLogout.rejected, (state) => {
      state.loading = false;
      state.apiStatus = false;
    });
    builder.addCase(chartData.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(chartData.fulfilled, (state, action) => {
      state.apiStatus = action.payload.status;
      state.loading = false;
      state.isFetching = false;
    });
    builder.addCase(chartData.rejected, (state) => {
      state.loading = false;
      state.apiStatus = false;
    });
    builder.addCase(signUpAccount.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(signUpAccount.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.apiStatus = action.payload.status;
      state.signUpData = action.payload.responseData;
    });
    builder.addCase(signUpAccount.rejected, (state, action) => {
      state.loading = false;
      state.apiStatus = false;
      state.error = action.payload.message;
    });
    builder.addCase(forgetData.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(forgetData.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.apiStatus = action.payload.status;
      state.forgetPass = action.payload.responseData;
    });
    builder.addCase(forgetData.rejected, (state) => {
      state.loading = false;
      state.apiStatus = false;
    });
    builder.addCase(getSSOUser.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(getSSOUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.apiStatus = action.payload.status;
      state.ssoUserData = action.payload.responseData;
    });
    builder.addCase(getSSOUser.rejected, (state, action) => {
      state.loading = false;
      state.apiStatus = false;
      state.error = action.payload.message;
    });
    builder.addCase(updateSSOUser.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(updateSSOUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.ssoUserStatus = action.payload.status;
      state.updateSSOData = action.payload.responseData;
    });
    builder.addCase(updateSSOUser.rejected, (state, action) => {
      state.loading = false;
      state.ssoUserStatus = false;
      state.error = action.payload.message;
    });
    builder.addCase(updatePhone.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(updatePhone.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.updateNumberData = action.payload.responseData;
    });
    builder.addCase(updatePhone.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(resetData.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(resetData.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.apiStatus = action.payload.status;
      state.resetPass = action.payload.responseData;
    });
    builder.addCase(resetData.rejected, (state, action) => {
      state.loading = false;
      state.apiStatus = false;
      state.error = action.payload.message;
    });
    builder.addCase(successData.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(successData.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.successValue = action.payload.responseData;
    });
    builder.addCase(successData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(notificationData.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(notificationData.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.notifyStatus = action.payload.status;
      state.notificationValues = action.payload.responseData;
    });
    builder.addCase(notificationData.rejected, (state, action) => {
      state.loading = false;
      state.notifyStatus = false;
      state.error = action.payload.message;
    });
    builder.addCase(fetchNotifyData.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(fetchNotifyData.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.listNotifyStatus = action.payload.status;
      state.listNotifyData = action.payload.responseData;
    });
    builder.addCase(fetchNotifyData.rejected, (state, action) => {
      state.loading = false;
      state.listNotifyStatus = false;
      state.error = action.payload.message;
    });
  },
});

export const { setLogin, setDefaultStatus } = sessionSlice.actions;
export default sessionSlice.reducer;
