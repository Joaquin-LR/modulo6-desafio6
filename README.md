<h1>Desafío 6: Autenticación y Autorización de usuarios con JWT</h1>
<p>Módulo 6: Backend con Node y Express (68) > Desafío - SoftJobs<br><br></p>

<h2>Instrucciones para el usuario</h2>
<ol>
  <li><p>Descargar el archivo presionando en el botón verde que indica "Code", y luego en Download ZIP.</p></li>
  <li><p>Descomprimir <code>modulo6-desafio6-main.zip</code> en un directorio deseado.</p></li>
  <li><p>Abrir la carpeta <code>modulo6-desafio6-main</code> en Visual Studio Code.</p></li>
  <li><p>Abrir una terminal (preferiblemente bash).</p></li>
  <li><p>Desde la carpeta <code>backend</code>, escribir <code>npm i</code> y ejecutar para instalar las dependencias.</p></li>
  <li><p>En el archivo <code>.env</code> reemplazar línea 3 de ser necesario</p></li>
  <li><p>Escribir en la terminal <code>npm start</code> o <code>npx nodemon index.js</code> y ejecutar. Esto hará correr el servidor.</p></li>
</ol>

<h2>Requisitos de configuración</h2>
<ul>
  <li><p>Crear una base de datos en PostgreSQL llamada "softjobs":</p>
    <code>CREATE DATABASE softjobs;</code>
  </li>
  <li><p>Crear la tabla "usuarios" con el siguiente comando:</p>
    <code>
      CREATE TABLE usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(60) NOT NULL,
        rol VARCHAR(25) NOT NULL,
        lenguage VARCHAR(20) NOT NULL
      );
    </code>
  </li>
</ul>

<h2>Pruebas de la API</h2>

<p>Se recomienda utilizar clientes de API como Thunder Client o <a href="https://www.postman.com/downloads/" target="_blank">Postman</a>.</p>

<h3>Thunder Client</h3>
<ul>
  <li><p>Instalar la extensión Thunder Client en VSCode desde el apartado de extensiones (Ctrl+Shift+X).</p></li>
  <li><p>Una vez instalada, buscar el ícono con forma de rayo en la barra izquierda de VSCode y presionarlo.</p></li>
  <li><p>Presionar el botón <b>New Request</b> para iniciar una nueva consulta.</p></li>
  <li><p>Escribir <code>localhost:3000</code> en la barra superior.</p></li>
  <li><p>Seleccionar el método HTTP en el desplegable a la izquierda de la barra (por defecto es "GET").</p></li>
  <li><p>Para realizar consultas, agregar un <code>/</code> seguido de la ruta deseada (por ejemplo, <code>/usuarios</code> o <code>/login</code>).</p></li>
  <li><p>Presionar el botón <b>Send</b> y revisar el resultado en la parte inferior.</p></li>
</ul>

<h3>Postman</h3>
<ul>
  <li><p>Descargar e instalar Postman desde su sitio oficial: <a href="https://www.postman.com/downloads/" target="_blank">Postman</a>.</p></li>
  <li><p>Abrir Postman y presionar el botón <b>New</b> en la parte superior izquierda.</p></li>
  <li><p>Seleccionar <b>Request</b> para crear una nueva consulta.</p></li>
  <li><p>Asignar un nombre a la consulta (opcional) y presionar <b>Save to collection</b> para guardarla, o saltar este paso.</p></li>
  <li><p>En el campo de URL, escribir <code>localhost:3000</code>.</p></li>
  <li><p>En el desplegable a la izquierda del campo de URL, seleccionar el método HTTP correspondiente (por defecto es "GET").</p></li>
  <li><p>Para realizar consultas, agregar un <code>/</code> seguido de la ruta deseada (por ejemplo, <code>/usuarios</code> o <code>/login</code>).</p></li>
  <li><p>Presionar el botón <b>Send</b> para ejecutar la consulta y revisar el resultado en el panel inferior.</p></li>
</ul>

<h3>Ejemplos de consultas</h3>
<ul>
  <li><p>Registrar un usuario:</p>
    <code>
      POST /usuarios<br>
      Body (JSON): {"email": "juanincognito@31minutos.com", "password": "123456", "rol": "Backend Developer", "lenguage": "JavaScript"}
    </code>
  </li>
  <li><p>Iniciar sesión con un usuario registrado:</p>
    <code>
      POST /login<br>
      Body (JSON): {"email": "juanincognito@31minutos.com", "password": "123456"}
    </code>
    <p>Copiar token generado</p>
  </li>
  <li><p>Obtener datos del usuario autenticado (requiere token):</p>
    <code>
      GET /usuarios<br>
      Headers: {"Authorization": "Bearer [insertar el token previamente copiado]"}
    </code>
  </li>
  <li><p>Registrar otro usuario:</p>
    <code>
      POST /usuarios<br>
      Body (JSON): {"email": "patana@31minutos.com", "password": "654321", "rol": "Frontend Developer", "lenguage": "Python"}
    </code>
  </li>
  <li><p>Intentar acceder a <code>/usuarios</code> sin token (debería fallar):</p>
    <code>
      GET /usuarios<br>
      Headers: Ninguno
    </code>
  </li>
</ul>

<h2>Créditos</h2>
<p>Desarrollado por Joaquín López Rojas para Desafío Latam, FullStack Javascript, Generación 68.<br>
Gracias por revisar mi desafío.</p>
