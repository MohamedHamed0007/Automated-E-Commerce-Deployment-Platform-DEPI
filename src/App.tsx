import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { useAppSelector, useAppDispatch } from './redux/hookredux';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { getProfile } from './redux/thunk/profileThunk';

function App() {
  const theme = useAppSelector((state) => state.theme.theme);
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token') || token;
    if (savedToken) {
      dispatch(getProfile());
    }
  }, [dispatch]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#1f2937' : '#fff',
            color: theme === 'dark' ? '#f9fafb' : '#111827',
            borderRadius: '8px',
            border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb'
          }
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
