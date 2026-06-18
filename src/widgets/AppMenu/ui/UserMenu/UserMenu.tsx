import { useNavigate } from 'react-router-dom';
import { useLogoutMutation, useMeQuery } from '@/features/Auth';

import { baseApi } from '@/shared/api';
import { useAppDispatch } from '@/shared/hooks';
import s from './UserMenu.module.css';

export const UserMenu = () => {
  const { data, isError } = useMeQuery();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  if (isError || !data) {
    return null;
  }

  const logoutHandler = async () => {
    try {
      await logout().unwrap();

      dispatch(baseApi.util.resetApiState());

      navigate('/login', { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={s.root}>
      <p className={s.login}>{data.email}</p>
      <button onClick={logoutHandler} className={s.logout}>
        Logout
      </button>
    </div>
  );
};
