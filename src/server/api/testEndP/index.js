import express from 'express'
import { mailTemplate } from 'src/server/util/mailTemplate'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 */
router.post('/', (req, res) => {
  console.log(' - /');
  let params = req.body
  console.log('params', params);
  // accessPlatform(params, (err, resp) => {
  //   if (err) return res.status(500).json(err)
    res.json(params)
  // })
})

/*
 */
router.post('/mail/', (req, res) => {
  console.log(' mail /');
  let params = req.body
  console.log('params', params);


  let User = {
    name : "test1",
    lastname: "test",
    email: "test1@test.com",
    username: "test1test"
  }

  let name = "Fundamental"

  let msg = '<p> <b> El estudiante: ' + User['name']+ ' ' + User['lastname'] + ', completo el nivel ' + name + '</b>' +
    '<p> <b> Usuario </b> : ' + User['username'] + '</p>' +
    '<p> <b> Nombre completo </b> : ' + User['name'] + ' ' + User['lastname'] + '</p>' +
    '<p> <b> Correo electrónico </b> : ' + User['email'] + '</p>' +
    '<p> <b> Nivel para certificar </b> : ' + name + '</p>' +
    '<a href="http://admin.akronenglish1.com/certification/edit/' + "5996f26d843a89d462ec7bfb" + '">Certificar Alumno</a>';

  let htmlView = mailTemplate (msg)

  let mailOptions = {
    from: 'mail@international.com', // sender address
    to: 'ingjuanleal1989@gmail.com', // list of receivers
    subject: 'Buzón de Consultas - Akron English', // Subject line
    html: htmlView, // html body
    attachments:[{
        filename: 'image001.png',
        path: 'src/server/img/image001.png',
        cid: 'logo@akron.com' //same cid value as in the html img src
    }]
  };



  // let msg =            '<p><b> Informaión. </b></p>' +
  //
  //                       '<p> <b> Usuario </b> : ' + 'test1' + '</p>' +
  //                       '<p> <b> Nombre completo </b> : ' +'test test' + '</p>' +
  //                       '<p> <b> Correo electrónico </b> : ' + 'tes1@gmail.com' + '</p>' +
  //                       '<p> <b> Tipo </b> : ' + 'estudiante' + '</p>' +
  //                       '<p> <b> Consulta </b> : ' + 'Hola profesor' + '</p>'+
  //
  //                       '<p><a target="_blank" href="https://akronenglish1.com/">' +
  //                         'akronenglish1.com' +
  //                       '</a></p>'
  //
  // let htmlView = mailTemplate (msg)
  //
  // let mailOptions = {
  //   from: 'mail@international.com', // sender address
  //   to: 'gaviriastban@gmail.com', // list of receivers
  //   subject: 'Buzón de Consultas - Akron English', // Subject line
  //   html: htmlView, // html body,
  //   attachments:[{
  //       filename: 'image001.png',
  //       path: 'src/server/img/image001.png',
  //       cid: 'logo@akron.com' //same cid value as in the html img src
  //   }]
  //
  // };

  _smtpTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('error', error);
        return res.json(error)
      }
      return res.json(info)
  });


  // accessPlatform(params, (err, resp) => {
  //   if (err) return res.status(500).json(err)
  // })
})


// se exporta el nuevo router
export default router
