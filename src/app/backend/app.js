const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir archivos estáticos

// Crear carpeta de uploads si no existe
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ej: 1743783439251.png
  }
});
const upload = multer({ storage });

// Endpoint de subida
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const imagePath = `/uploads/${req.file.filename}`; // <-- CORREGIDO
  res.status(200).send({ message: 'File uploaded successfully', imagePath });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
