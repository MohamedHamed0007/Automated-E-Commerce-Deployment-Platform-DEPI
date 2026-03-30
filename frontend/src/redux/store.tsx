// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeRedux/themeSlice";
import navigationReducer from "./navigateRedux/navigateSlice";
import authReducer from "./slices/authSlice";
import shipmentReducer from "./slices/shipmentSlice";
import trackingReducer from "./slices/trackingSlice";
import paymentReducer from "./slices/paymentSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    navigation: navigationReducer,
    auth: authReducer,
    shipment: shipmentReducer,
    tracking: trackingReducer,
    payment: paymentReducer,
  }
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;