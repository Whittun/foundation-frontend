import { Navigate, Outlet } from 'react-router-dom';
import { useMeQuery } from '@/features/Auth';

export const ProtectedRoute = () => {
  const { data, isLoading, isError } = useMeQuery();

  if (isLoading) {
    return null;
  }

  if (isError || !data) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
