const express = require("express");
const libre = require("libreoffice-convert");
const util = require("util");

libre.convertAsync = util.promisify(libre.convert);

const app = express();
app.use(express.json({ limit: "10mb" }));

app.post("/convert", async (req, res) => {
  try {
    const { file } = req.body;

    const docxBuffer = Buffer.from(file, "base64");

    const pdfBuffer = await convertToPdf(docxBuffer, ".pdf");

    console.log("PDF size:", pdfBuffer.length);


    res.json({
      pdf: pdfBuffer.toString("base64"),
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

function convertToPdf(buffer) {
  return new Promise((resolve, reject) => {
    libre.convert(buffer, '.pdf', null, (err, done) => {

      if (err) {
        console.error("❌ LibreOffice ERROR:", err);
        return reject(err);
      }

      if (!done) {
        console.error("❌ LibreOffice devolvió vacío");
        return reject(new Error("PDF vacío"));
      }

      console.log("✅ PDF generado, tamaño:", done.length);

      resolve(done);
    });
  });
}

app.listen(4000, () => console.log("PDF service on 4000"));

