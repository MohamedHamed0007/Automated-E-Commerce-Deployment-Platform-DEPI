import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import type { JSX } from 'react';

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  // Get token directly from your Redux auth slice
  const { accessToken, loading } = useSelector((state: RootState) => state.auth);

  // Optional: Show a loading spinner if you are currently
  // checking for a refresh token or initializing the app
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If no token exists in the state, redirect to login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the protected component
  return children;
}
