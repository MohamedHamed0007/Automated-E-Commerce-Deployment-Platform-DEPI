import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// تحديد نوع الـ state بوضوح
interface NavigationState {
  currentPath: string;
}

const initialState: NavigationState = {
  currentPath: "/", // الصفحة الافتراضية
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    navigate: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
    },
  },
});

export const { navigate } = navigationSlice.actions;
export default navigationSlice.reducer;