import { useLoginMutation } from '../../api/authApi';
import { AuthForm } from '../../components/AuthForm';
import type { AuthRequest } from '../../types/authTypes';

import s from './LoginPage.module.css';

export const LoginPage = () => {
  const [login] = useLoginMutation();

  const handleLogin = (data: AuthRequest) => {
    login(data);
  };

  return (
    <div className={s.root}>
      <AuthForm title={'Log in'} sendData={handleLogin} />
    </div>
  );
};
