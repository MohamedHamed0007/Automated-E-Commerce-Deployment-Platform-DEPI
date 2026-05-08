import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { useAppSelector, useAppDispatch } from './redux/hookredux';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { getProfile } from './redux/thunk/profileThunk';

function App() {
  const theme = useAppSelector((state) => state.theme.theme);
  const dispatch = useAppDispatch();

  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await dispatch(getProfile()).unwrap();
        console.log('Auth initialized: User logged in');
      } catch (error) {
        console.warn('Auth initialized: No active session.');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div
        className={`h-screen w-full flex items-center justify-center ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className={theme === 'dark' ? 'text-white' : 'text-gray-600'}>Loading ShipSphere...</p>
        </div>
      </div>
    );
  }

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
