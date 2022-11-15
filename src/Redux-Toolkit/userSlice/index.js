import { createSlice } from '@reduxjs/toolkit';
import {
  allUsersList,
  deleteUserId,
  userDetails,
  fetchUserRole,
  fetchOrg,
  createUser,
  fetchOrgNames,
  fullUserDetails,
  updateUserData,
  postData,
} from './action';

const initialState = {
  loading: false,
  isFetching: false,
  apiStatus: null,
  apiFullStatus: null,
  roleStatus: null,
  userDetailStatus: null,
  newApiStatus: null,
  updateStatus: null,
  errMsg: null,
  updateData: [],
  postValues: [],
  orgNames: [],
  response: [],
  usersList: [],
  userFullData: [],
  userFetchData: [],
  newUserData: [],
  orgData: [],
  roleDatas: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /* eslint no-param-reassign:"error" */
    setDefault: (state) => {
      state.loading = false;
      state.apiStatus = null;
      state.apiFullStatus = null;
      state.roleStatus = null;
      state.newApiStatus = null;
      state.userDetailStatus = null;
      state.updateStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(allUsersList.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(allUsersList.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.apiStatus = action.payload.status;
      state.usersList = action.payload.responseData;
    });
    builder.addCase(allUsersList.rejected, (state, action) => {
      state.loading = false;
      state.apiStatus = false;
      state.errMsg = action.payload.message;
    });
    builder.addCase(deleteUserId.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(deleteUserId.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.apiFullStatus = action.payload.status;
      state.response = action.payload.responseData;
    });
    builder.addCase(deleteUserId.rejected, (state, action) => {
      state.loading = false;
      state.apiFullStatus = false;
      state.errMsg = action.payload.message;
    });
    builder.addCase(userDetails.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(userDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.userDetailStatus = action.payload.status;
      state.userFullData = action.payload.responseData;
    });
    builder.addCase(userDetails.rejected, (state, action) => {
      state.loading = false;
      state.userDetailStatus = false;
      state.errMsg = action.payload.message;
    });
    builder.addCase(fetchUserRole.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(fetchUserRole.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.roleStatus = action.payload.status;
      state.roleDatas = action.payload.responseData;
    });
    builder.addCase(fetchUserRole.rejected, (state, action) => {
      state.loading = false;
      state.roleStatus = false;
      state.errMsg = action.payload.message;
    });
    builder.addCase(fetchOrg.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(fetchOrg.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.orgData = action.payload.responseData;
    });
    builder.addCase(fetchOrg.rejected, (state, action) => {
      state.loading = false;
      state.errMsg = action.payload.message;
    });
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.newApiStatus = action.payload.status;
      state.newUserData = action.payload.responseData;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.newApiStatus = false;
      state.errMsg = action.payload.message;
    });
    builder.addCase(fullUserDetails.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(fullUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.apiStatus = action.payload.status;
      state.userFetchData = action.payload.responseData;
    });
    builder.addCase(fullUserDetails.rejected, (state, action) => {
      state.loading = false;
      state.apiStatus = false;
      state.errMsg = action.payload.message;
    });
    builder.addCase(updateUserData.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(updateUserData.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.updateStatus = action.payload.status;
      state.updateData = action.payload.responseData;
    });
    builder.addCase(updateUserData.rejected, (state, action) => {
      state.loading = false;
      state.updateStatus = false;
      state.errMsg = action.payload.message;
    });
    builder.addCase(fetchOrgNames.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(fetchOrgNames.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.orgNames = action.payload.responseData;
    });
    builder.addCase(fetchOrgNames.rejected, (state, action) => {
      state.loading = false;
      state.errMsg = action.payload.message;
    });
    builder.addCase(postData.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(postData.fulfilled, (state, action) => {
      state.loading = false;
      state.isFetching = false;
      state.postValues = action.payload.responseData;
    });
    builder.addCase(postData.rejected, (state, action) => {
      state.loading = false;
      state.errMsg = action.payload.message;
    });
  },
});

export const { setDefault } = userSlice.actions;
export default userSlice.reducer;
