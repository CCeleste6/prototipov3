import React, { useEffect, useState } from 'react';
import API, { setToken } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [leaderboard, setLeaderboard] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return nav('/');
    setToken(token);
    API.get('/users/me').then(r => setUser(r.data.user)).catch(()=>nav('/'));
    API.get('/points/leaderboard').then(r => setLeaderboard(r.data.top)).catch(()=>{});
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {user && (
        <div>
          <p><b>{user.name}</b> — {user.role}</p>
          <p>PM: {user.pm} • PC: {user.pc} • Rank: {user.rank}</p>
        </div>
      )}
      <hr />
      <button onClick={()=>nav('/activities')}>Ver atividades</button>
      <h3>Top alunos</h3>
      <ol>
        {leaderboard.map(u => <li key={u.id}>{u.name} — {u.pm} PM</li>)}
      </ol>
    </div>
  );
}
