import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import shipmentsReducer from "./shipmentsSlice";
import usersReducer from "./usersSlice";
import chatReducer from "./chatSlice";
import { injectStore } from "@/lib/axiosInstance";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    shipments: shipmentsReducer,
    users: usersReducer,
  },
});

// ── مهم: inject الـ store في axiosInstance ──────────────────────────────
// عشان الـ interceptors يقدروا يوصلوا للـ token والـ dispatch
injectStore(store);

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
