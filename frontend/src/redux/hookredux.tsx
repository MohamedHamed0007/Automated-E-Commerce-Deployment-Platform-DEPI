import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";
// --------------------
// dispatch مع type مضبوط
// --------------------
export const useAppDispatch: () => AppDispatch = useDispatch;

// --------------------
// selector مع type مضبوط
// --------------------
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// --------------------
// Theme Hook
// --------------------
export const useThemeRedux = () => {
  const theme = useAppSelector((state) => state.theme.theme); // state.theme.theme حسب slice
  return theme;
};

// --------------------
// Navigation Hook
// --------------------
export const useNavigationRedux = () => {
  const currentPage = useAppSelector((state) => state.navigation.lastClicked);
  const dispatch = useAppDispatch();

  const navigateRedux = (page: string) => {
    dispatch({ type: "navigation/setNavigation", payload: page });
  };

  return { currentPage, navigateRedux };
};