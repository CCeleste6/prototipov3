import React, { useState } from 'react';
import API, { setToken } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await API.post('/auth/login', { email, password });
      const { token, user } = r.data;
      localStorage.setItem('token', token);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      nav('/dashboard');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Erro ao logar');
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><label>Senha</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button type="submit">Entrar</button>
      </form>
      <p>Use <b>aluno@demo.com / aluno123</b> ou <b>prof@demo.com / prof123</b> (seed)</p>
      {msg && <div style={{color:'red'}}>{msg}</div>}
    </div>
  );
}
