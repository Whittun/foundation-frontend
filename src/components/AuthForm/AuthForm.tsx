import React from 'react';
import type { AuthRequest } from '../../types/authTypes';
import s from './AuthForm.module.css';

type AuthFormProps = {
  title: string;
  sendData: (data: AuthRequest) => void;
};

export const AuthForm = ({ title, sendData }: AuthFormProps) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    sendData({
      email,
      password,
    });
  };

  return (
    <div className={s.root}>
      <h1 className={s.title}>{title}</h1>
      <form onSubmit={handleSubmit} className={s.form}>
        <p className={s.inputWrap}>
          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={s.input}
            id="email"
            type="email"
          />
        </p>
        <p className={s.inputWrap}>
          <label htmlFor="password">Password</label>
          <input
            onChange={(event) => setPassword(event.target.value)}
            className={s.input}
            id="password"
            type="password"
          />
        </p>
        <button className={s.send}>Send</button>
      </form>
    </div>
  );
};
