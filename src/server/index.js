// import config from 'src/server/common/config'
import http from 'http'
import express from 'express'
import mongoose from 'mongoose'
import api from 'src/server/api'
import bodyParser from 'body-parser'
import path from 'path'
import passport from 'passport'
import { Strategy } from 'passport-local'
import { getUser, getUserDev } from 'src/server/lib/user'
import expressSession from 'express-session'
import { shaEncryp } from 'src/server/util/util'
import socketIO from 'src/server/socketIO'
import nodemailer from 'nodemailer'
import cron from 'node-cron'

import Mailgun from 'mailgun-js'
import Constants from 'src/server/constants'

import connectMongo from 'connect-mongo';

import { getUsersWithEvents } from 'src/server/lib/notification'
import { verifyUsersSendEmail } from 'src/server/lib/month-disconnect-task'

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at ` ` in route handlers after authentication.

// estrategia local para loguear usuarios aprendices
passport.use('learnerDev-local', new Strategy((username, password, cb) => {
  // Se arma el query para buscar el user

  console.log('username, password', username, password);

  let query = {
    username: username,
    email: username,
    password: password,
    // se especifica que el operador de búsqueda por campos específicos debe ser un or
    _isOrOperation: '1',
    // se especifica que busque exactamente los parámetros enviando
    _matchExactly: '1'
  }

  // se busca el usuario
  getUserDev(query, (err, users) => {

    console.log('err, users', err, users);

    if (err) {
      console.log('getUserDev err: ', err)
      return cb(err)
    }
    if (users === 0) {
      console.log('users === 0');
      return cb(null, false)
    }

    // usuario encontrado
    let user = users
    if (!user) {
      console.log('!user');
      return cb(null, false)
    }

    return cb(null, user)
  }, true)
}))

//Variable global para configurar el correo electrónico y enviar los emails
global._smtpTransport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "akroninternational537@gmail.com",
    pass: "akroninternational1"
  }
});

//Configuración mail gun - envío correo masivos
let api_key = 'key-1d68d05e134d4a11c4daefa13072e79d';
let domain = 're-bilingual.com';
// let api_key = '6472910ca9c4c5d438ab7cd38ddde51f-b6183ad4-4b744786';
// let domain = 'sandbox3087694b2bc547db89c4215a8c72c92e.mailgun.org';
// let domain = Constants.DOMAIN;
global._mailgun = new Mailgun({apiKey: api_key, domain: domain});


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  // query para realizar la búsqueda
  let query = {
    _id: id,
    // se especifica que busque exactamente los parámetros enviando
    _matchExactly: '1'
  }

  // se busca el usuario
  getUser(query, (err, users) => {
    if (err) {
      return cb(err)
    }
    if (users.total === 0) {
      return cb(null, false)
    }

    return cb(null, users.data[0])
  }, true)
})

// se inicia express para controlar las rutas y archivos estaticos
const app = express()
// se crea el servidor con configuraciones basicas de express
const server = http.createServer(app)
// se define el puerto que se utilizará para escuchar las peticiones
const port = process.env.PORT || 3017
mongoose.Promise = global.Promise;
// se conecta a la base de datos MONGODB donde se almacenaran los datos
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://cosmoEditor:tCmY49WBhcSQwyrs@127.0.0.1:27017/cosmo')

// La api va a recibir peticiones desde otros dominios, se habilitan los cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', "true");
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
})
// se devuelven automaticamente los archivos estaticos

// se almacena la direccion absoluta raiz para uso global en la app
let dirname = path.resolve(__dirname)
global._rootPath = dirname.substring(0, dirname.lastIndexOf('/dist/src'))

app.use(express.static(path.join(__dirname, '..', '..', '..', 'public')))
app.use(express.static(path.join(__dirname, '..', '..', '..', 'resources')))
// se inicia el servidor de sockets
const Io = new socketIO({server: server})
// se llama la funcion que inicia los eventos
Io.initSocket()
// se convierten los datos que vienen en la peticion a formato json
app.use(bodyParser.json())
// se indica que no solo acepte codificación UTF-8
app.use(bodyParser.urlencoded({extended: false}))
const MongoStore = connectMongo(expressSession);

// express session
app.use(expressSession({
  secret: shaEncryp('mySecretKey'),
  resave: true,
  rolling: true,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {
    maxAge: 7200000
  }
}))
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.get('/notification', (req, res) => {
  getUsersWithEvents();
  res.json('success')
})

// se crea el middleware que contendrá todos los endpoints de la api
app.use('/api', api)

app.post('/loginlearnerDev', passport.authenticate('learnerDev-local', {session: true}), getUserData)

// send all requests POST to index.html from /user-area/calendar/
app.post('/user-area/calendar/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', '..', 'public', 'index.html'))
})


app.get('/logoutuser', function (req, res) {
  // se destruye la session actual
  req.logout()
  // se devuelve un 200 porque se deslogueó
  res.json('success')
})

// send all requests to index.html so browserHistory works
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', '..', 'public', 'index.html'))
})

function getUserData(req, res) {
  // se arma el arreglo a enviar al usuario logueado con sus datos de session
  let userToFront = {
    role: req.user.role,
    _id: req.user.id,
    username: req.user.username,
    name: req.user.name,
    email: req.user.email,
    lastname: req.user.lastname,
    gender: req.user.gender,
    userIdDev: req.user.userIdDev,
    profileImg: req.user.profileImg,
    acceptTerms: req.user.acceptTerms
  }

  console.log('userToFront', userToFront);
  return res.json(userToFront);
  // si se autenticó exitosamente se devuelve un 200 y el usuario

}

//Cron que se ejecuta cada semana para notificar a los usuarios que tienen eventos vía facebook y correo electrónico
const task = cron.schedule('00 9 * * 1', function () { //'* * * * *'
  getUsersWithEvents();
});

// Con que se ejecuta cada mes
// Enviar un correo de recordatorio a los alumnos que no se conectan hace mas de un mes
// const disconectTask = cron.schedule('* * * */1 *', function(){
//   console.log('running a task every month');
//   verifyUsersSendEmail();
// });

server.listen(port, () => console.log(`Server listening on port ${port}`))
