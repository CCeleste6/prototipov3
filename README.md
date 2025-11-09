# Legado Escolar - Protótipo

Backend (Express + SQLite) e Frontend (React + Vite).

Pré-requisitos:
- Node.js 18+
- npm

1) Backend
cd backend
cp .env.example .env
# editar .env se quiser
npm install
npm run seed
npm start
API disponível em http://localhost:4000

2) Frontend
cd frontend
npm install
# ajustar VITE_API_URL se API não estiver no localhost
npm run dev
App disponível em http://localhost:5173

Credenciais seed:
- Professor: prof@demo.com / prof123
- Aluno: aluno@demo.com / aluno123
