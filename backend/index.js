require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env
const express = require('express'); 
const cors = require('cors'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const { Pool } = require('pg'); 

const pool = new Pool({
  user: 'postgres', // REEMPLAZAR CON USUARIO DE PostgreSQL
  host: 'localhost',
  database: 'softjobs', 
  password: process.env.DB_PASSWORD, // REEMPLAZAR CON CONTRASEÑA DE PostgreSQL
  port: 5432, // Puerto por defecto de PostgreSQL
});

// Prueba de conexión a la base de datos al iniciar el servidor
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err); // Si falla la conexión, mostrar error y detener el servidor
    process.exit(1); // Detiene el proceso de Node.js
  } else {
    console.log('Conexión exitosa a PostgreSQL:', res.rows); // Mensaje de éxito en caso de conexión correcta
  }
});

// Configuración del servidor Express
const app = express();
const SECRET_KEY = process.env.SECRET_KEY; // REEMPLAZAR CON (CREAR) Clave secreta para firmar y verificar los tokens JWT

// Middlewares globales
app.use(express.json());
app.use(cors());

// Middleware personalizado: Verificar credenciales en las solicitudes de registro o inicio de sesión
const verifyCredentials = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // Si faltan credenciales, responder con un error 400
    return res.status(400).send({ message: 'Email y contraseña son obligatorios.' });
  }
  next(); // Pasar al siguiente middleware o ruta
};

// Middleware personalizado: Verificar la validez del token JWT en las rutas protegidas
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Extraer el encabezado Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Si no se proporciona un token o es inválido, responder con un error 401
    return res.status(401).send({ message: 'Token no proporcionado o inválido.' });
  }
  const token = authHeader.split(' ')[1]; // Extraer el token después de "Bearer"
  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verificar y decodificar el token usando la clave secreta
    req.email = decoded.email; // Almacenar el email decodificado para usarlo en la ruta
    next(); // Pasar al siguiente middleware o ruta
  } catch (error) {
    res.status(401).send({ message: 'Token inválido o expirado.' }); // Responder si el token no es válido
  }
};

// Ruta para registrar un nuevo usuario
app.post('/usuarios', verifyCredentials, async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body; // Extraer datos del cuerpo de la solicitud
    const hashedPassword = bcrypt.hashSync(password, 10); // Encriptar la contraseña antes de guardarla
    const query = 'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)';
    await pool.query(query, [email, hashedPassword, rol, lenguage]); // Ejecutar la consulta para registrar al usuario
    res.status(201).send({ message: 'Usuario registrado con éxito.' }); // Responder con éxito
  } catch (error) {
    console.error('Error al registrar usuario:', error); // Mostrar el error en el servidor
    res.status(500).send({ message: 'Error al registrar usuario.', error }); // Responder con un error 500
  }
});

// Ruta para iniciar sesión y devolver un token JWT
app.post('/login', verifyCredentials, async (req, res) => {
  try {
    const { email, password } = req.body; // Extraer credenciales del cuerpo de la solicitud
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const { rows } = await pool.query(query, [email]); // Buscar el usuario en la base de datos

    if (rows.length === 0 || !bcrypt.compareSync(password, rows[0].password)) {
      // Si no se encuentra el usuario o la contraseña no coincide, responder con un error 401
      return res.status(401).send({ message: 'Email o contraseña incorrectos.' });
    }

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' }); // Generar un token JWT válido por 1 hora
    res.send({ token }); // Enviar el token al cliente
  } catch (error) {
    console.error('Error al iniciar sesión:', error); // Mostrar el error en el servidor
    res.status(500).send({ message: 'Error al iniciar sesión.', error }); // Responder con un error 500
  }
});

// Ruta protegida para obtener datos del usuario autenticado
app.get('/usuarios', verifyToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const { rows } = await pool.query(query, [req.email]); // Buscar el usuario en la base de datos usando el email del token

    if (rows.length === 0) {
      // Si no se encuentra el usuario, responder con un error 404
      return res.status(404).send({ message: 'Usuario no encontrado.' });
    }

    res.send(rows); // Enviar los datos del usuario como respuesta
  } catch (error) {
    console.error('Error al obtener usuario:', error); // Mostrar el error en el servidor
    res.status(500).send({ message: 'Error al obtener usuario.', error }); // Responder con un error 500
  }
});

// Iniciar el servidor en el puerto definido
const PORT = 3000; // Puerto en el que se ejecutará el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`); // Mensaje de éxito al iniciar el servidor
});
