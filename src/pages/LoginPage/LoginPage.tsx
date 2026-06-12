import { authApi, useLoginMutation } from '../../api/authApi';
import { AuthForm } from '../../components/AuthForm';
import { useAppDispatch } from '../../hooks';
import type { AuthRequest } from '../../types/authTypes';

import s from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login] = useLoginMutation();

  const handleLogin = async (data: AuthRequest) => {
    try {
      await login(data).unwrap();
      dispatch(authApi.util.resetApiState());
      navigate('/yearTracker');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={s.root}>
      <AuthForm title={'Log in'} sendData={handleLogin} />
    </div>
  );
};
