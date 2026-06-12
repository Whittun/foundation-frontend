import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../api/authApi';
import { AuthForm } from '../../components/AuthForm';
import type { AuthRequest } from '../../types/authTypes';

import s from './RegisterPage.module.css';
import React from 'react';
import { getErrorMessage } from '../../utils/getErrorMessage';

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
