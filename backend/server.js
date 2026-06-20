require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const axios = require("axios");


const { 
  initDatabase, 
  ensureDefaultUser, 
  validateUserCredentials,
  pool // IMPORTANTE: necesitás exportarlo desde db.js
} = require('./db');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '8h';

const app = express();

app.use(cors({
  exposedHeaders: ['X-File-Name']
}));

app.use(express.json());


app.use('/uploads', express.static('uploads'))


/* ------------------ AUTH ------------------ */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.startsWith('Bearer ') && authHeader.slice(7);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token requerido',
    });
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }

    req.user = payload;
    next();
  });
}

/* ------------------ HEALTH ------------------ */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

/* ------------------ LOGIN ------------------ */
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await validateUserCredentials(username, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username }, // ✅ agrego id
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ success: true, token });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});

/* ------------------ CREAR PARTE ------------------ */
app.post('/api/upload-audio', authenticateToken, async (req, res) => {
  try {
    const { audio } = req.body;

    if (!audio) {
      return res.status(400).json({
        success: false,
        message: 'Audio requerido',
      });
    }

    const id_medico = req.user.id;

    // ⚠️ FIX provisional (después lo hacés dinámico)
    const id_paciente = 1;

    const result = await pool.query(
      `INSERT INTO parte (id_paciente, id_medico, audio_base64)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id_paciente, id_medico, audio]
    );

    res.json({
      success: true,
      parte: result.rows[0],
    });

  } catch (error) {
    console.error('Error creando parte:', error);

    res.status(500).json({
      success: false,
      message: 'Error al guardar el parte',
    });
  }
});

app.post('/api/generar-pdf', authenticateToken, async (req, res) => {
  try {
    const {
      informe,
      id_paciente,
    } = req.body;

    const id_medico = req.user.id;

    // 🔹 1. Obtener datos de DB
    const pacienteRes = await pool.query(
      'SELECT nombre, apellido FROM paciente WHERE id = $1',
      [id_paciente]
    );
    const paciente = pacienteRes.rows[0];

    const medicoRes = await pool.query(
      'SELECT username FROM medico WHERE id = $1',
      [id_medico]
    );
    const medico = medicoRes.rows[0];

    // 🔹 2. Armar datos para template
    const data = {
      NOMBRE_PACIENTE: paciente
        ? `${paciente.nombre} ${paciente.apellido}`
        : '',

      NOMBRE_MEDICO: medico?.username || '',
      INFORME: informe || '',

      FECHA: new Date().toLocaleString('es-AR', {
          timeZone: 'America/Argentina/Buenos_Aires',
          hour12: false
        }),

    };

    // 🔥 3. Generar PDF (usa docx + pdf-service)
    const pdfBuffer = await generarPdfDesdeTemplate(data);

    // ✅ 4. DEVOLVER PDF AL FRONTEND
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=parte_${Date.now()}.pdf`
    );

    
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }

    
    const nombreArchivo = `parte_${Date.now()}.pdf`
    const rutaArchivo = path.join('uploads', nombreArchivo)
    res.setHeader('X-File-Name', nombreArchivo)


    // guardar archivo
    fs.writeFileSync(rutaArchivo, pdfBuffer)

    res.send(pdfBuffer)

  } catch (error) {
    console.error("Error generando PDF:", error);

    res.status(500).json({
      success: false,
      message: "Error generando PDF",
    });
  }
});


/* ------------------ VERIFY ------------------ */
app.get('/api/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Acceso autorizado',
    user: req.user,
  });
});

/* ------------------ obtener paciente - medico ------------------ */
app.get('/api/mis-pacientes', authenticateToken, async (req, res) => {
  try {
    const id_medico = req.user.id;

    const result = await pool.query(
      `SELECT p.*
       FROM paciente p
       JOIN medico_paciente mp ON p.id = mp.id_paciente
       WHERE mp.id_medico = $1`,
      [id_medico]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener pacientes' });
  }
});

app.post('/api/asignar-paciente', authenticateToken, async (req, res) => {
  try {
    const { id_paciente } = req.body;
    const id_medico = req.user.id;

    await pool.query(
      `INSERT INTO medico_paciente (id_medico, id_paciente)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [id_medico, id_paciente]
    );

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ message: 'Error asignando paciente' });
  }
});

app.post('/api/paciente', authenticateToken, async (req, res) => {
  try {
    const { nombre, apellido, mail, dni, diagnostico } = req.body;
    const id_medico = req.user.id;

    // 1. Crear paciente
    const result = await pool.query(
      `INSERT INTO paciente (nombre, apellido, mail, dni, diagnostico)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, apellido, mail, dni, diagnostico]
    );

    const paciente = result.rows[0];

    // 2. Relacionarlo con el médico
    await pool.query(
      `INSERT INTO medico_paciente (id_medico, id_paciente)
       VALUES ($1, $2)`,
      [id_medico, paciente.id]
    );

    res.json(paciente);

  } catch (error) {
    res.status(500).json({ message: 'Error creando paciente' });
  }
});

app.get('/api/paciente/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    'SELECT * FROM paciente WHERE id = $1',
    [id]
  );

  res.json(result.rows[0]);
});

app.get('/api/partes/:id_paciente', authenticateToken, async (req, res) => {
  const { id_paciente } = req.params;

  const result = await pool.query(
    `SELECT * FROM parte
     WHERE id_paciente = $1
     ORDER BY fecha_creacion DESC`,
    [id_paciente]
  );

  res.json(result.rows);
});

/* ------------------ START ------------------ */
async function startServer() {
  try {
    await initDatabase();
    await ensureDefaultUser();

    app.listen(3001, '0.0.0.0', () => {   // ✅ importante para Docker
      console.log('Servidor en puerto 3001');
    });

  } catch (error) {
    console.error('Error al inicializar la base de datos', error);
    process.exit(1);
  }
}

startServer();


async function generarPdfDesdeTemplate(data) {
  const templatePath = path.resolve(__dirname, "template_informe.docx");

  const content = fs.readFileSync(templatePath, "binary");

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render(data);

  const docxBuffer = doc.getZip().generate({
    type: "nodebuffer",
  });

  
  const debugDocxPath = path.resolve(__dirname, "debug.docx");
  fs.writeFileSync(debugDocxPath, docxBuffer);

  console.log("DOCX generado ✅");


  // 🔥 ENVIAR al pdf-service
  const response = await axios.post(
    "http://pdf-service:4000/convert" ,
    {
      file: docxBuffer.toString("base64"),
    }
  );

  const pdfBuffer = Buffer.from(response.data.pdf, "base64");

  return pdfBuffer;
}

const { sendPdfMail } = require('./mailer');

app.post('/api/send-pdf', authenticateToken, async (req, res) => {
  try {
    const { id_paciente, fileName } = req.body;
    console.log(fileName)

    const paciente = await pool.query(
    'SELECT mail, nombre, apellido FROM paciente WHERE id = $1',
    [id_paciente]
  )

  const email = paciente.rows[0].mail
  const nombreCompleto = paciente.rows[0].nombre + " " + paciente.rows[0].apellido

    await sendPdfMail({
      to: email,
      fileName,
      nombrePaciente: nombreCompleto
    });

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
});

app.delete('/api/delete-pdf', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.body

    const filePath = path.join(__dirname, 'uploads', filename)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    res.json({ ok: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false })
  }
})

app.post('/api/generar-parte', authenticateToken, async (req, res) => {
  try{

    const {id_paciente, nombreArchivo} = req.body
    const id_medico = req.user.id;
    
    await pool.query(
      `INSERT INTO parte (id_paciente, id_medico, archivo)
      VALUES ($1, $2, $3)`,
      [id_paciente, id_medico, nombreArchivo]
    )

    res.json({ok: true})
  }catch(error){
    console.log(error)
    res.status(500).json({ ok: false })
  }
})