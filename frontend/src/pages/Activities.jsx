import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return nav('/');
    API.get('/activities').then(r => setActivities(r.data.activities));
  }, []);

  async function submit() {
    if (!selected) return;
    await API.post(`/activities/${selected}/submit`, { format: 'text', content });
    alert('Enviado. Pontos serão atualizados.');
    setContent('');
  }

  return (
    <div>
      <h2>Atividades</h2>
      <ul>
        {activities.map(a => (
          <li key={a.id}>
            <b>{a.title}</b> — {a.description} • {a.base_pm} PM
            <button onClick={() => setSelected(a.id)}>Selecionar</button>
          </li>
        ))}
      </ul>

      {selected && (
        <div style={{ marginTop: 20 }}>
          <h3>Enviar resposta</h3>
          <textarea rows={6} cols={60} value={content} onChange={e => setContent(e.target.value)} />
          <div>
            <button onClick={submit}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}
