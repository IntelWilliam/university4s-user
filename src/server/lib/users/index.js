/**
 *   Controlador para administrar el módulo de usuarios en la aplicación.
 *
 *   @author: Sebastián Lara <jlara@kijho.com>
 *  @author: Daniel Loaiza <dfloaiza@gmail.com>
 *
 *   @date: 30/06/2015
 *  @updated: 6/08/2016
 */

/**
 * Dependencies
 */
import User from 'src/server/models/UserChat'

// se guarda la notificacion para registrar llamas perdidas o mensajes no vistos
export function notifyChat (userId, data, callback){

  User.findOneAndUpdate( {userIdDev: userId} , data , function(err, users) {
    if (err) {
      console.log('err', err);
      return callback({ status: 500, error: err })
    } else {
      return callback(null, {
        status: 200,
        data: {
          users: users
        }
      })
    }
  })
}


/**
 *   Función responsable de unir un usuario al listado de usuarios online.
 *   @param data Object, datos del usuario.
 */
export function joinUser(user, socketId, callback) {


  user.userId = user['_id']
  delete user['_id']
    // se valida el usuario antes de agregarlo
  user.socket = {
    id: socketId
  };
  if (user.role == 'teacher') {
    user.studentsOnline = 0
  }
  user.status = 1;
  user.profileImg = "profileImg" in user ? user.profileImg : ''
  if (validateUser(user)) {

    User.findOneAndUpdate({ userIdDev: user.userIdDev }, user, { upsert: true, new: true })
      .lean().exec(function(err, userFound) {
        if (err) {
          console.log("err", err)
          return callback({ status: 500, error: err })
        }

        if (userFound) {
          callback(null, {
            status: 200,
            data: {
              user: userFound
            }
          })
        } else {
          callback(null, {
            status: 404,
            data: null
          })
        }
      })

  } else {
    callback({
      status: 500,
      error: 'Invalid user data'
    })
  }
}

export function incTeacherStudents(id, quantity) {
  // se incrementa
  User.findByIdAndUpdate(id, { $inc: { studentsOnline: quantity } }, { safe: true, upsert: true, new: true }, (err, user) => {})
}

export function decTeacherStudents(id, quantity) {
  // se decrementa
  User.findByIdAndUpdate(id, { $dec: { studentsOnline: quantity } }, { safe: true, upsert: true, new: true }, (err, user) => {})
}

/**
 * Función responsable de obtener todos los estudiantes online
 */
export function getOnlineUsers(role, callback) {
  User.find({ role: role, status: 1 }).lean().exec(function(err, users) {
    if (err) {
      return callback({ status: 500, error: err })
    }
    if (users) {
      callback(null, {
        status: 200,
        data: {
          users: users
        }
      })
    } else {
      callback(null, {
        status: 404,
        data: null
      })
    }
  })
}

/**
 * Función responsable de actualizar el estado de un usuario.
 * @param data, nuevo estado del usuario
 */
export function updateUserStatus(socketId, status, callback) {
  // si el usuario existe, se actualiza el estado
  User.findOneAndUpdate({ "socket.id": socketId }, { status: status }, null, function(err, users) {
    if (err) {
      console.log('err', err);
      return callback({ status: 500, error: err })
    } else {
      return callback(null, {
        status: 200,
        data: {
          users: users
        }
      })
    }
  })
}

/**
 * Función responsable de actualizar el estado de un usuario.
 * @param data, nuevo estado del usuario
 */
export function findUserBySocket(socketId, callback) {
  // si el usuario existe, se actualiza el estado
  User.findOne({ "socket.id": socketId }).lean()
    .exec((err, user) => {
      if (err) {
        console.log('err', err);
        return callback({ status: 500, error: err })
      } else {
        return callback(null, {
          status: 200,
          data: {
            user: user
          }
        })
      }
    })
}

/**
 * Función responsable de asignar un profesor como candidato a la llamada
 * es un candidato el cual se elige en orden de conexion
 */
export function assignCandidateTeacher(callback) {
  // busco un profesor en linea y ordeno por el que esté atendiendo menos estudiantes
  User.findOne({ role: "teacher", status: 1 }).sort({ studentsOnline: 1 }).lean()
    .exec((err, user) => {
      if (err) {
        console.log(err, 'error en candidate');
        return callback({ status: 500, error: err })
      }

      callback(null, {
        status: 200,
        data: {
          user: user
        }
      })
    })
}

// Funcion encargada de cambiar el estado de profesor y alumno cuando estan en llamada
export function assignCall(data, callback) {
  User.update({ $or: [{ "socket.id": data.from }, { "socket.id": data.to }] }, { inCall: 1 }, {
      multi: true,
    }).lean()
    .exec(function(err, rawData) {
      if (err) return callback({ status: 500, error: err })

      User.find({ $or: [{ "socket.id": data.from }, { "socket.id": data.to }] })
        .lean()
        .exec(function(err, users) {
          if (err) return callback({ status: 500, error: err })

          if (users) {
            callback(null, {
              status: 200,
              data: {
                users: users
              }
            })
          } else {
            callback(null, {
              status: 404,
              data: null
            })
          }
        })

    })
}

/**
 * Función responsable de validar la información de un usuario.
 */
export function validateUser(user) {
  // se supone el peor de los casos
  var result = false

  // se valida que la información exista y sea no vacía
  if (user) {
    // validamos que exista el id del usuario para agregarlo
    if (("userIdDev" in user) && ("socket" in user) && ("role" in user)) {
      result = true
    }
  }
  return result
}
