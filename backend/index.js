const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

// Configuração melhorada do CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Criar diretório de uploads se não existir
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));

let touristPoints = [];

// Configuração melhorada do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// ➕ Adicionar ponto turístico (Versão melhorada)
app.post('/tourist-points', upload.single('photo'), (req, res, next) => {
  try {
    const { name, description, latitude, longitude } = req.body;
    
    // Validação dos campos obrigatórios
    if (!name || !description) {
      return res.status(400).json({ 
        error: 'Nome e descrição são obrigatórios' 
      });
    }

    // Verifica se o arquivo foi enviado corretamente
    let photoPath = null;
    if (req.file) {
      photoPath = req.file.path;
      
      // Verifica se o arquivo realmente foi salvo
      if (!fs.existsSync(photoPath)) {
        throw new Error('O arquivo não foi salvo corretamente');
      }
    }

    const newTouristPoint = {
      id: Date.now(),
      name,
      description,
      photo: photoPath ? path.relative(uploadDir, photoPath) : null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      createdAt: new Date().toISOString()
    };

    touristPoints.push(newTouristPoint);
    
    console.log('Novo ponto criado:', newTouristPoint); // Log para depuração
    
    res.status(201).json(newTouristPoint);
  } catch (error) {
    next(error); // Passa o erro para o middleware de tratamento
  }
});

app.get('/tourist-points', (req, res) => {
  res.json(touristPoints);
});



app.listen(3000, () => {
  console.log('Backend listening on port 3000');
  console.log(`Uploads directory: ${uploadDir}`);
});