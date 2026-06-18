import { useNavigate } from 'react-router-dom';
import { AuthForm, type AuthRequest, useRegisterMutation } from '@/features/Auth';
import { getErrorMessage } from '@/shared/lib';

import React from 'react';
import s from './RegisterPage.module.css';

export const RegisterPage = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  const handleRegister = async (data: AuthRequest) => {
    try {
      setError(null);

      await register(data).unwrap();
      navigate('/yearTracker');
    } catch (error) {
      setError(getErrorMessage(error));

      console.error(error);
    }
  };

  return (
    <div className={s.root}>
      <AuthForm
        title={'Registration'}
        isLoading={isLoading}
        serverError={error}
        sendData={handleRegister}
      />
    </div>
  );
};
