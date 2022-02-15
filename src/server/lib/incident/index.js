import { mailTemplate } from 'src/server/util/mailTemplate'

/*
 * Esta función permite enviar un correo electrónico con la petición de la consulta
 */

const firstQuestion = '¿En qué nivel y lección se encuentra?';
const secondQuestion = 'Cuéntanos qué paso y adjunta una foto.';
const thirdQuestion = '¿Tienes alguna sugerencia para mejorar tu experiencia con la plataforma?';

export function sendConsult(data, callback) {

  if (data['firstAnswer'] && data['secondAnswer'] && data['thirdAnswer']
    && data['email'] && data['name'] && data['lastName'] && data['phone']
    && data['homePhone'] && data['titularName'] && data['titularLastName']
    && data['attach'])
    { //Se pregunta si existen los campos requeridos
    // Se configura la vista que va a tener el correo electrónico
    let msg = '<ul> Información del Alumno:' +
      '<li> Nombre: ' + data['name'] + ' ' + data['lastName'] + '</li>' +
      '<li> Email: ' + data['email'] + '</li>' +
      '<li> Movil: ' + data['phone'] + '</li>' +
      '<li> Teléfono casa: ' + data['homePhone'] + '</li>' + '</ul>' +
      '<ul> Información del Titular:' +
      '<li> Nombre: ' + data['titularName'] + ' ' + data['titularLastName'] + '</li>' + '</ul>' +
      '<ul> Reporta un problema' +
      '<li>' + firstQuestion + '<p> <b>' + data['firstAnswer'] + '</p> </b>'+ '</li>' +
      '<li>' + secondQuestion + '<p> <b>' + data['secondAnswer'] + '</p> </b>' + '<p> <b>' +
      '<a href="https://akronenglish1.com/api/file-chat/'+ data['attach'] + '">Archivo adjunto</a>' + '</p> </b>' + '</li>' + '</ul>' +
      '<ul> Envíanos tus recomendaciones' +
      '<li>' + thirdQuestion + '<p> <b>' + data['thirdAnswer'] + '</p> </b>' + '</li>' + '</ul>';

    let htmlView = mailTemplate (msg)


    let mailOptions = {
      from: 'mail@international.com', // sender address
      to: 'soportemejoras@akronenglish.com', // list of receivers
      subject: 'Buzón de Consultas - Akron English', // Subject line
      html: htmlView, // html body,
      attachments:[{
        filename: 'image001.png',
        path: 'https://image.re-cosmo.com/source/image001.png',
        cid: 'logo@akron.com' //same cid value as in the html img src
      }]
    };


    //Se envia el correo
    _smtpTransport.sendMail(mailOptions, (error, info) => {
      if (error) {
        if (data['file']) { //Se pregunta si existe un archivo, para agregarlo al error y eliminarlo
          error['file'] = data['file'];
        }
        return callback(error);
      }
      callback(null, data);
    });
  } else {
    let error = {};
    if (data['file']) { //Se pregunta si existe un archivo, para agregarlo al error y eliminarlo
      error['file'] = data['file'];
    }
    error['info'] = "Faltan campos requeridos";
    callback(error);
  }

}
