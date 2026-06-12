import { useNavigate } from 'react-router-dom';
import { authApi, useLogoutMutation, useMeQuery } from '../../api/authApi';

import s from './AuthenticatedUser.module.css';
import { useAppDispatch } from '../../hooks';
import { resetUserSessionCache } from '../../utils/resetUserSessionCache';

export const AuthenticatedUser = () => {
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
      resetUserSessionCache(dispatch);
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
