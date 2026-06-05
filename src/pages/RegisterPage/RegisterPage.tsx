import { useRegisterMutation } from '../../api/authApi';
import { AuthForm } from '../../components/AuthForm';
import type { AuthRequest } from '../../types/authTypes';

import s from './RegisterPage.module.css';

export const RegisterPage = () => {
  const [register] = useRegisterMutation();

  const handleRegister = (data: AuthRequest) => {
    register(data);
  };

  return (
    <div className={s.root}>
      <AuthForm title={'Registration'} sendData={handleRegister} />
    </div>
  );
};
