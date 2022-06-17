import { default as Certification } from 'src/server/models/Certification';
import { default as User } from 'src/server/models/User';
import { addUserDate } from 'src/server/lib/reports';
import { addLabAccess } from 'src/server/lib/lab-access';
import Constants from 'src/server/constants';
import request from 'request';
import { Types } from 'mongoose';
import { mailTemplate } from 'src/server/util/mailTemplate';

/*
 * Esta función permite buscar un usuario y agregar una fecha de acceso
 */
export function accessPlatform(params, callback) {
  let userDevId = params.userDevId;
  User.findOne({ userIdDev: userDevId }, (err, User) => {
    if (err) return console.log(err);
    if (User) {
      // actualiza la ultimma fecha de conexion (Reporte de Mes sin conexión)
      User.lastConection = new Date();
      User.save(() => {});

      let userDate = {
        userId: User._id,
        userName: User.name,
        userLastName: User.lastname,
        userEmail: User.email,
        platform: 'intermedia',
      };
      addUserDate(userDate, (err, resp) => {
        if (err) {
          return console.log(err);
        }

        return callback(null, resp);
      });
    } else {
      return callback(null, 'not found');
    }
  });
}

/*
 * Esta función permite buscar un usuario y agregar una fecha de acceso
 */
export function accessLaboratory(params, callback) {
  let userDevId = params.userDevId;

  // talk Conversacion
  // class
  // reinforcement

  let cat = 0;

  if (params.category == 'Completar Oraciones' || params.category == 'class') {
    cat = 1;
  }
  if (params.category == 'Ordenar Oraciones' || params.category == 'talk') {
    cat = 2;
  }
  if (
    params.category == 'Marcar la Respuesta' ||
    params.category == 'reinforcement'
  ) {
    cat = 3;
  }

  User.findOne({ userIdDev: userDevId }, (err, User) => {
    if (err) return console.log(err);
    if (User) {
      let labDate = {
        userId: User._id,
        userName: User.name,
        userLastName: User.lastname,
        userEmail: User.email,

        category: cat,
        // category -> videos - practicas
        // 1 Completar - Clase, 2 Ordenar - Conversacion, 3 Marcar-Reforzamiento
        nivel: params.nivel,
        sublevel: params.sublevel,
        lesson: params.lessonIndex,

        platform: 'intermedia',
        type: params.type,
        videoName: params.accessName,
      };

      addLabAccess(labDate, (err, resp) => {
        if (err) {
          return console.log(err);
        }

        return callback(null, resp);
      });
    } else {
      return callback(null, 'not found');
    }
  });
}

/*
 * Esta función permite buscar un usuario y agregar una fecha de acceso
 */
export function approveDifficult(params, callback) {
  console.log('approveDifficult', approveDifficult);

  let userDevId = params.userDevId;

  User.findOne({ userIdDev: userDevId }, (err, User) => {
    if (err) return console.log(err);
    if (User) {
      request(
        {
          uri:
            (process.env.API_BASE_URL || Constants.API_BASE_URL) +
            'user_data/' +
            userDevId,
          method: 'GET',
        },
        (err, response, body) => {
          if (!err && response.statusCode == 200) {
            let userNotes = JSON.parse(body);
            // console.log('userNotes', userNotes);

            var presentExams = 0;
            var tries = 0;
            var missingOral = false;
            var missingOralSubLevel = '';

            // envia correo a akron si el estudiante termino un nivel
            checkNoteLevel(userNotes, User);

            for (var property in userNotes) {
              for (var prop in userNotes[property]) {
                let element = userNotes[property][prop];

                if (element.grammar || element.listening || element.reading) {
                  // si el intento es diferente a 0 ha presentado el examen por lo menos una vez
                  if (element.grammar.try != 0) {
                    presentExams =
                      parseInt(element.grammar.note) >= 70
                        ? presentExams + 1
                        : presentExams;
                    tries += parseInt(element.grammar.try);
                  }
                  if (element.listening.try != 0) {
                    presentExams =
                      parseInt(element.listening.note) >= 70
                        ? presentExams + 1
                        : presentExams;

                    tries += parseInt(element.listening.try);
                  }
                  if (element.reading.try != 0) {
                    presentExams =
                      parseInt(element.reading.note) >= 70
                        ? presentExams + 1
                        : presentExams;

                    tries += parseInt(element.reading.try);
                  }

                  // se verifica si solo falta la nota de oral para aprobar el subnivel
                  // unicamente en niveles 1 y 3
                  if (parseInt(prop) == 1 || parseInt(prop) == 3) {
                    if (
                      element.grammar.try > 0 &&
                      element.listening.try > 0 &&
                      element.reading.try > 0 &&
                      element.oral_exam == 0 &&
                      element.total_note < 70
                    ) {
                      missingOral = true;
                      missingOralSubLevel = property + ' ' + prop;
                    }
                  }
                }
              }
            }

            let approveDifficult = (presentExams / tries) * 100;

            let toSave = {
              approveDifficult,
              missingOral,
              missingOralSubLevel,
              userNotes,
              presentExams,
              tries,
            };

            User.approveDifficult = approveDifficult;
            User.missingOral = missingOral;
            User.missingOralSubLevel = missingOralSubLevel;
            User.save(() => {});

            // console.log('toSave', toSave);
            return callback(null, toSave);
          } else if (err) {
            console.log('err', err);
            return callback(err);
            // return err
          } else {
            return console.log('toSave', body);
          }
        }
      );

      // addLabAccess(labDate, (err, resp) => {
      //   if (err) {
      //     return console.log(err);
      //   }
      //
      //   return callback(null, resp)
      // })
    } else {
      return callback(null, 'not found');
    }
  });
}

function checkNotifyAndSendMail(name, level, User) {
  // console.log('User', User);
  // console.log('checkNotifyAndSendMail', name, level , User.name);

  if (User.notifyCert && User.notifyCert == level) {
    // ya se notifico
    console.log('ya se notifico');
    return;
  } else {
    let date = new Date();

    let newData = {
      userName: name,
      certificationLevel: level,
      comment: date.toString(),
      userId: User._id,
    };

    updateCertification(newData, User);

    let msg =
      '<p> <b> El estudiante: ' +
      User['name'] +
      ' ' +
      User['lastname'] +
      ', completo el nivel ' +
      name +
      '</b>' +
      '<p> <b> Usuario </b> : ' +
      User['username'] +
      '</p>' +
      '<p> <b> Nombre completo </b> : ' +
      User['name'] +
      ' ' +
      User['lastname'] +
      '</p>' +
      '<p> <b> Correo electrónico </b> : ' +
      User['email'] +
      '</p>' +
      '<p> <b> Nivel para certificar </b> : ' +
      name +
      '</p>' +
      '<a href="http://admin.akronenglish1.com/certification/edit/' +
      User._id +
      '">Certificar Alumno</a>';

    let htmlView = mailTemplate(msg);

    let mailOptions = {
      from: 'mail@international.com', // sender address
      to: 'consultasacademicas@akronenglish.com\n', // list of receivers
      subject: 'Buzón de Consultas - Akron English', // Subject line
      html: htmlView, // html body
      attachments: [
        {
          filename: 'image001.png',
          path: 'src/server/img/image001.png',
          cid: 'logo@akron.com', //same cid value as in the html img src
        },
      ],
    };

    //Se envia el correo
    _smtpTransport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('error', error);
      }

      // actualiza la ultimma fecha de conexion (Reporte de Mes sin conexión)
      User.notifyCert = level;
      User.save(() => {});
    });
  }
}

/*
 * Esta función actualiza un registro
 */
function updateCertification(newData, User) {
  if ('userId' in newData && 'certificationLevel' in newData) {
    var userId_ = new Types.ObjectId(newData.userId);
    newData.userId = userId_;
    var query = {
      userId: userId_,
    };
  } else {
    return console.log('faltan datos');
  }

  if ('entityId' in newData) {
    let entityId_ = new Types.ObjectId(newData.entityId);
    newData.entityId = entityId_;
  }

  Certification.findOneAndUpdate(
    query,
    { $set: newData },
    { safe: true, upsert: true, new: true },
    (err, certification) => {
      if (err) {
        console.log('Certification err', err);
        return console.log(err);
      }
      User.certificationLevel = certification.certificationLevel;
      User.save(() => {});
    }
  );
}

function checkNoteLevel(userNotes, User) {
  if (userNotes.initial && userNotes.fundamental && userNotes.operational) {
    // nota de inicial es mayor a 70 y otros niveles sin notas
    if (
      parseInt(userNotes.initial.level_note) > 70 &&
      parseInt(userNotes.fundamental.level_note) == 0 &&
      parseInt(userNotes.operational.level_note) == 0
    ) {
      checkNotifyAndSendMail('Inicial', 1, User);
      // nota de fundamental mayor a 70 y operacional sin notas
    } else if (
      parseInt(userNotes.fundamental.level_note) >= 70 &&
      parseInt(userNotes.operational.level_note) == 0
    ) {
      checkNotifyAndSendMail('Fundamental', 2, User);
      // nota de operacional mayor a 70
    } else if (parseInt(userNotes.operational.level_note) >= 70) {
      checkNotifyAndSendMail('Operacional', 3, User);
    }
  }
}
