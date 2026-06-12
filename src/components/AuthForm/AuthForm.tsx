import React from 'react';
import type { AuthRequest } from '../../types/authTypes';
import s from './AuthForm.module.css';
import clsx from 'clsx';

type AuthFormProps = {
  title: string;
  serverError?: string | null;
  sendData: (data: AuthRequest) => void;
  isLoading: boolean;
};

export const AuthForm = ({ title, sendData, serverError, isLoading }: AuthFormProps) => {
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

  const handlePasswordBlur = () => {
    setIsTouchedPassword(true);
  };

  const handleEmailBlur = () => {
    setIsTouchedEmail(true);
  };

  return (
    <div className={s.root}>
      <h1 className={s.title}>{title}</h1>
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
          {isLoading ? 'Loading...' : 'Send'}
        </button>
      </form>
    </div>
  );
};
