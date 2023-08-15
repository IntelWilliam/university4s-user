import { mailTemplate } from 'src/server/util/mailTemplate'

/*
 * Esta función permite enviar un correo electrónico con la petición de la consulta
 */
export function sendConsult(data, callback) {
  if (data['username'] && data['fullname'] && data['email'] && data['type'] && data['comment']) { //Se pregunta si existen los campos requeridos
    // Se configura la vista que va a tener el correo electrónico
    let msg = '<p> <b> Usuario </b> : ' +  ['username'] + '</p>' +
      '<p> <b> Nombre completo </b> : ' + data['fullname'] + '</p>' +
      '<p> <b> Correo electrónico </b> : ' + data['email'] + '</p>' +
      '<p> <b> Tipo </b> : ' + data['type'] + '</p>' + 
      '<p> <b> Consulta </b> : ' + data['comment'] + '</p>';

    let htmlView = mailTemplate (msg)


    let mailOptions = {
      from: 'mail@international.com', // sender address
      to: 'akroninternational537@gmail.com', // list of receivers
      subject: 'Buzón de Consultas - Akron English', // Subject line
      html: htmlView, // html body,
      attachments:[{
          filename: 'image001.png',
          path: 'src/server/img/image001.png',
          cid: 'logo@akron.com' //same cid value as in the html img src
      }]
    };

    if (data['file']) { //Se pregunta si existe un archivo, para adjuntarlo a la configuración
      mailOptions['attachments'] = [{
        filename: data['fileName'], //Nombre del archivo original
        path: data['file'] //Ruta del path del archivo
      }]
    }
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

/*
 * Esta función permite enviar un correo electrónico con la Contraseña
 */
export function sendPass(email, newpass, callback) {
  if (email) { //Se pregunta si existen los campos requeridos
    // Se configura la vista que va a tener el correo electrónico
    let msg =

      '<p> <b> Correo electrónico </b> : ' + email + '</p>' +
      '<p> <b> Nueva Contraseña </b> : ' + newpass + '</p>';

    let htmlView = mailTemplate (msg)


    let mailOptions = {
      from: 'mail@international.com', // sender address
      to: email, // list of receivers
      // to: 'akroninternational537@gmail.com', // list of receivers
      subject: 'Recordar contraseña - Akron English', // Subject line
      html: htmlView, // html body
      attachments:[{
        filename: 'image001.png',
        path: 'https://image.re-cosmo.com/source/image001.png',
        cid: 'logo@akron.com' //same cid value as in the html img src
      }]
    };

    //Se envia el correo
    _smtpTransport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return callback(error);
      }
      callback(null, email);
    });
  } else {
    callback(error);
  }

}
