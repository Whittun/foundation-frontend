import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm, authApi, useLoginMutation, type AuthRequest } from '../../../features/Auth';
import { useAppDispatch } from '../../../shared/hooks';
import { getErrorMessage } from '../../../shared/lib';
import s from './LoginPage.module.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [error, setError] = React.useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (data: AuthRequest) => {
    try {
      setError(null);

      await login(data).unwrap();
      dispatch(authApi.util.resetApiState());
      navigate('/yearTracker');
    } catch (error) {
      setError(getErrorMessage(error));
      console.error(error);
    }
  };

  return (
    <div className={s.root}>
      <AuthForm title={'Log in'} isLoading={isLoading} serverError={error} sendData={handleLogin} />
    </div>
  );
};
