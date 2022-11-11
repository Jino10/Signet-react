import { createSlice } from '@reduxjs/toolkit';
import {
  userAllTickets,
  fetchSiteData,
  fetchPriorityData,
  fetchProblemData,
  fetchSystemData,
  fetchTicketData,
  ticketsUpdate,
  viewTicket,
  dashboardData,
  profileUpdate,
} from './action';

const initialState = {
  userTickets: [],
  ticketData: [],
  chartData: [],
  profileData: [],
  siteList: [],
  priorityList: [],
  problemList: [],
  systemList: [],
  loading: false,
  isFetching: false,
  apiStatus: null,
  profileStatus: null,
  isError: null,
  error: null,
};

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    /* eslint no-param-reassign:"error" */
    setTickets: (state) => {
      state.isError = null;
      state.apiStatus = null;
      state.profileStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userAllTickets.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(userAllTickets.fulfilled, (state, action) => {
      state.userTickets = action.payload.responseData;
      state.apiStatus = action.payload.status;
      state.loading = false;
      state.isFetching = false;
    });
    builder.addCase(userAllTickets.rejected, (state, action) => {
      state.loading = false;
      state.apiStatus = false;
      state.error = action.payload.message;
    });
    builder.addCase(fetchSiteData.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(fetchSiteData.fulfilled, (state, action) => {
      state.siteList = action.payload;
      state.loading = false;
      state.isFetching = false;
    });
    builder.addCase(fetchSiteData.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchPriorityData.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(fetchPriorityData.fulfilled, (state, action) => {
      state.priorityList = action.payload;
      state.loading = false;
      state.isFetching = false;
    });
    builder.addCase(fetchPriorityData.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchProblemData.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(fetchProblemData.fulfilled, (state, action) => {
      state.problemList = action.payload;
      state.loading = false;
      state.isFetching = false;
    });
    builder.addCase(fetchProblemData.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchSystemData.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(fetchSystemData.fulfilled, (state, action) => {
      state.systemList = action.payload;
      state.loading = false;
      state.isFetching = false;
    });
    builder.addCase(fetchSystemData.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchTicketData.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(fetchTicketData.fulfilled, (state, action) => {
      state.dataList = action.payload;
      state.loading = false;
      state.isFetching = false;
    });
    builder.addCase(fetchTicketData.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(ticketsUpdate.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(ticketsUpdate.fulfilled, (state, action) => {
      state.apiStatus = action.payload.status;
      state.loading = false;
      state.isFetching = false;
    });
    builder.addCase(ticketsUpdate.rejected, (state, action) => {
      state.loading = false;
      state.apiStatus = false;
      state.isFetching = false;
      state.isError = false;
      state.error = action.payload.message;
    });
    builder.addCase(viewTicket.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(viewTicket.fulfilled, (state, action) => {
      state.apiStatus = action.payload.status;
      state.ticketData = action.payload.responseData;
      state.loading = false;
      state.isFetching = false;
    });
    builder.addCase(viewTicket.rejected, (state) => {
      state.loading = false;
      state.apiStatus = false;
    });
    builder.addCase(dashboardData.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(dashboardData.fulfilled, (state, action) => {
      state.chartData = action.payload.responseData;
      state.apiStatus = action.payload.status;
      state.loading = false;
      state.isFetching = false;
    });
    builder.addCase(dashboardData.rejected, (state) => {
      state.loading = false;
      state.apiStatus = false;
    });
    builder.addCase(profileUpdate.pending, (state) => {
      state.loading = true;
      state.isFetching = true;
    });
    builder.addCase(profileUpdate.fulfilled, (state, action) => {
      state.profileStatus = action.payload.status;
      state.profileData = action.payload.responseData;
      state.loading = false;
      state.isFetching = false;
    });
    builder.addCase(profileUpdate.rejected, (state, action) => {
      state.loading = false;
      state.profileStatus = false;
      state.error = action.payload.message;
    });
  },
});

export const { setTickets } = ticketSlice.actions;
export default ticketSlice.reducer;
