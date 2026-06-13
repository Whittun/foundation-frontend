import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, useLoginMutation } from '../../../api/authApi';
import { AuthForm } from '../../../components/AuthForm';
import { useAppDispatch } from '../../../hooks';
import type { AuthRequest } from '../../../types/authTypes';
import { getErrorMessage } from '../../../utils/getErrorMessage';
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
