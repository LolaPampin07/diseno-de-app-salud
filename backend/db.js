const crypto = require('crypto');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

/* ------------------ HASH ------------------ */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/* ------------------ INIT DB ------------------ */
async function initDatabase() {
  const query = `
    CREATE TABLE IF NOT EXISTS medico (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      passwordhash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS paciente (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      apellido VARCHAR(100) NOT NULL,
      mail VARCHAR(150),
      dni VARCHAR(20) UNIQUE,
      diagnostico TEXT,
      nro_cama VARCHAR(3) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS medico_paciente (
    id SERIAL PRIMARY KEY,
    id_medico INTEGER NOT NULL,
    id_paciente INTEGER NOT NULL,

    CONSTRAINT fk_medico
        FOREIGN KEY (id_medico)
        REFERENCES medico(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_relacion UNIQUE (id_medico, id_paciente)
);

    CREATE TABLE IF NOT EXISTS parte (
      id SERIAL PRIMARY KEY,
      id_paciente INTEGER NOT NULL,
      id_medico INTEGER NOT NULL,
      fecha_creacion TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      audio_base64 TEXT,
      transcripcion TEXT,
      estado VARCHAR(20) DEFAULT 'pendiente',
      archivo VARCHAR(50),

      CONSTRAINT fk_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES paciente(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_medico
        FOREIGN KEY (id_medico)
        REFERENCES medico(id)
        ON DELETE CASCADE
    );
  `;

  await pool.query(query);
}

/* ------------------ USERS ------------------ */
async function getUserByUsername(username) {
  const result = await pool.query(
    'SELECT id, username, passwordhash FROM medico WHERE username = $1',
    [username]
  );

  return result.rows[0] || null;
}

async function createUser(username, rawPassword) {
  const passwordhash = hashPassword(rawPassword);

  const result = await pool.query(
    `INSERT INTO medico (username, passwordhash)
     VALUES ($1, $2)
     RETURNING id, username`,
    [username, passwordhash]
  );

  return result.rows[0];
}

async function ensureDefaultUser() {
  const usuarios = ['master', 'lola', 'eugenia', 'ailen'];

  for (const username of usuarios) {
    const existingUser = await getUserByUsername(username);

    if (!existingUser) {
      await createUser(username, '1234');
      console.log(`Usuario creado: ${username}`);
    }
  }
}

/* ------------------ LOGIN ------------------ */
async function validateUserCredentials(username, rawPassword) {
  const user = await getUserByUsername(username);

  if (!user) {
    console.log('No se encontró el usuario');
    return null;
  }

  const inputHash = hashPassword(rawPassword);

  if (inputHash !== user.passwordhash) {
    console.log('Contraseña inválida');
    return null;
  }

  return { id: user.id, username: user.username };
}

/* ------------------ EXPORT ------------------ */
module.exports = {
  initDatabase,
  ensureDefaultUser,
  createUser,
  getUserByUsername,
  validateUserCredentials,
  pool,
};