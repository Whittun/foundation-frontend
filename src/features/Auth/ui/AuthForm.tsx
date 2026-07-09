import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import type { AuthRequest } from '../model/authTypes';
import s from './AuthForm.module.css';

type AuthFormProps = {
  title: string;
  serverError?: string | null;
  sendData: (data: AuthRequest) => void;
  isLoading: boolean;
  mode?: 'login' | 'register';
};

export const AuthForm = ({
  title,
  sendData,
  serverError,
  isLoading,
  mode = 'login',
}: AuthFormProps) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isTouchedPassword, setIsTouchedPassword] = React.useState<boolean>(false);
  const [isTouchedEmail, setIsTouchedEmail] = React.useState<boolean>(false);

  const isInvalidPassword = password.length < 8;
  const isInvalidEmail = email.trim().length <= 0;

  const isInvalidFields = isInvalidEmail || isInvalidPassword;

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isInvalidFields) {
      setIsTouchedEmail(true);
      setIsTouchedPassword(true);
      return;
    }

    sendData({
      email,
      password,
    });
  };

  const passwordError =
    isTouchedPassword && isInvalidPassword ? 'Password must be at least 8 characters long' : null;

  const emailError = isTouchedEmail && isInvalidEmail ? 'Required field' : null;
  const submitText = mode === 'register' ? 'Sign up' : 'Sign in';

  const handlePasswordBlur = () => {
    setIsTouchedPassword(true);
  };

  const handleEmailBlur = () => {
    setIsTouchedEmail(true);
  };

  return (
    <div className={s.root}>
      <h1 className={s.title}>{title}</h1>
      <p>
        Foundation is an independent app for capturing your life path, reflections, and personal
        progress over time.
      </p>
      <form onSubmit={handleSubmit} className={s.form}>
        {serverError && <span className={s.error}>{serverError}</span>}
        <p className={s.inputWrap}>
          <label className={s.label} htmlFor="email">
            Email
          </label>
          <input
            onBlur={handleEmailBlur}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            className={s.input}
            id="email"
            type="email"
            required
          />
          {emailError && <span className={s.error}>{emailError}</span>}
        </p>
        <p className={s.inputWrap}>
          <label className={s.label} htmlFor="password">
            Password
          </label>
          <input
            onBlur={handlePasswordBlur}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            value={password}
            className={s.input}
            id="password"
            type="password"
            required
          />
          {passwordError && <span className={s.error}>{passwordError}</span>}
        </p>
        <button
          disabled={isInvalidFields || isLoading}
          className={clsx(s.send, { [s.disabledSend]: isInvalidFields || isLoading })}
          type="submit"
        >
          {isLoading ? 'Loading...' : submitText}
        </button>
        {mode === 'login' && (
          <p className={s.linkText}>
            Don't you have an account?{' '}
            <Link className={s.link} to={'/register'}>
              Sign up
            </Link>
          </p>
        )}
        {mode === 'register' && (
          <p className={s.linkText}>
            Do you already have an account?{' '}
            <Link className={s.link} to={'/login'}>
              Log in
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};
