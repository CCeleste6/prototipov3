const { init } = require('./db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  const db = await init();

  const ranks = [
    ['Aprendiz', 0, 2000],
    ['Estudante', 2001, 5000],
    ['Pesquisador', 5001, 9000],
    ['Acadêmico', 9001, 14000],
    ['Mentor', 14001, 20000],
    ['Erudito', 20001, 28000],
    ['Filósofo', 28001, 40000],
    ['Sábio', 40001, 55000],
    ['Luminar', 55001, 80000],
    ['Oráculo', 80001, null]
  ];
  await db.run(`DELETE FROM ranks`);
  for (const [name, minp, maxp] of ranks) {
    await db.run(`INSERT INTO ranks(name,min_points,max_points) VALUES(?,?,?)`, [name, minp, maxp]);
  }

  await db.run(`DELETE FROM houses`);
  const houses = [
    ['Casa Guardiã', 'Disciplina e responsabilidade'],
    ['Casa Visionária', 'Criatividade e inovação'],
    ['Casa Solidária', 'Empatia e cooperação'],
    ['Casa Precursora', 'Liderança e iniciativa']
  ];
  for (const [name, desc] of houses) {
    await db.run(`INSERT INTO houses(id,name,description,pc) VALUES(?,?,?,0)`, [uuidv4(), name, desc]);
  }

  const teacherId = uuidv4();
  const studentId = uuidv4();
  const hashedT = await bcrypt.hash('prof123', 10);
  const hashedS = await bcrypt.hash('aluno123', 10);

  try {
    await db.run(`INSERT INTO users(id,name,email,password,role,school,house,pm,pc,rank) VALUES(?,?,?,?,?,?,?,?,?,?)`,
      [teacherId, 'Professor Demo', 'prof@demo.com', hashedT, 'teacher', 'Colégio XYZ', null, 0, 0, 'Mentor']);
    await db.run(`INSERT INTO users(id,name,email,password,role,school,house,pm,pc,rank) VALUES(?,?,?,?,?,?,?,?,?,?)`,
      [studentId, 'Aluno Demo', 'aluno@demo.com', hashedS, 'student', 'Colégio XYZ', 'Casa Precursora', 36556, 6533, 'Sábio']);
  } catch (e) {
   }

  await db.run(`DELETE FROM activities`);
  await db.run(`INSERT INTO activities(id,title,description,format,base_pm,created_at) VALUES(?,?,?,?,?,?)`,
    [uuidv4(), 'Atividade: Bhaskara', 'Resolver equação quadrática e enviar passo a passo', 'text', 20, new Date().toISOString()]);
  await db.run(`INSERT INTO activities(id,title,description,format,base_pm,created_at) VALUES(?,?,?,?,?,?)`,
    [uuidv4(), 'Projeto: Mini-protótipo', 'Entregar protótipo em vídeo ou imagem', 'video', 30, new Date().toISOString()]);

  console.log('Seed completo');
  process.exit(0);
}

seed();
