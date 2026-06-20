const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const sendPdfMail = async ({ to, fileName, nombrePaciente }) => {
  const filePath = path.join(__dirname, 'uploads', fileName);
    console.log("Envio mail");
  return transporter.sendMail({
    from: `"CuidApp <${process.env.GMAIL_USER}>`,
    to,
    subject: `Parte médico - ${nombrePaciente}`,
    text: 'Se envía adjunto el parte médico.',
    attachments: [
      {
        filename: fileName,
        path: filePath
      }
    ]
  });
};

module.exports = { sendPdfMail };