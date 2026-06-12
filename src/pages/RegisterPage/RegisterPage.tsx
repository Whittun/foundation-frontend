import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../api/authApi';
import { AuthForm } from '../../components/AuthForm';
import type { AuthRequest } from '../../types/authTypes';

import s from './RegisterPage.module.css';

export const RegisterPage = () => {
  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  const handleRegister = async (data: AuthRequest) => {
    try {
      await register(data).unwrap();
      navigate('/yearTracker');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={s.root}>
      <AuthForm title={'Registration'} sendData={handleRegister} />
    </div>
  );
};
