import React from 'react';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>Legado Escolar (Prototype)</h1>
      <Outlet />
    </div>
  );
}
