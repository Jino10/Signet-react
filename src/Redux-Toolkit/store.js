import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from './sessionSlice/index'
import ticketReducer from "./ticketSlice/index";
import userReducer from './userSlice/index';

export const store = configureStore({
    reducer: {
        session: sessionReducer,
        ticket: ticketReducer,
        user: userReducer
    }
})