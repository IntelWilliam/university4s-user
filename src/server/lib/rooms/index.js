/**
 *   Controlador para administrar el módulo de usuarios en la aplicación.
 *
 *  @author: Daniel Loaiza <dfloaiza@gmail.com>
 *
 *   @date: 08/08/2016
 */

/**
 * Dependencies
 */
import Room from 'src/server/models/Room'

/*
 * Esta función crea un nuevo registro
 */
export function joinRoom(users, roomType, callback) {

  // Se valida si la sala ya está creada
  let generatedRoomId = `${users[0].userIdDev}-${users[1].userIdDev}`;
  Room.findOne({ id: generatedRoomId }).lean().exec(function(err, room) {
    if (err) {
      return callback({ status: 500, error: err })
    }
    if (room) {
      // console.log("encuentra la room", room)
      callback(null, {
        status: 200,
        data: {
          room: room
        }
      })
    } else {
      // en caso de no estar creada se crea y retorna la room
      Room.create({ id: generatedRoomId, users: users, roomType: roomType, status: 0 }, (err, room) => {
        // console.log("creo la room", room)
        if (err) return callback({ status: 500, error: err })
        callback(null, {
          status: 200,
          data: {
            room: room
          }
        })
      })
    }
  })
}

export function leaveRoom(roomId, callback) {

  // se busca la sala y posteriormente se elimina
  getRoom(roomId, function(err, response) {
    if (err) {
      console.log("entro a err");
      return callback(err)
    }

    // Se valida si se encontró la room, entonces se puede eliminar
    if (response.status === 200) {
      Room.remove({ id: roomId }, function(err, info) {
        if (err) {
          console.log("hubo un error", err)
          return callback({ status: 500, error: err })
        }

        callback(null, {
          status: 204,
          data: response.data
        })
      })
    } else {
      callback(null, response)
    }
  })
}

export function leaveRooms(socketId) {

  Room.remove({ "users.socket.id": socketId }, function(err, info) {})
}

/**
 * Función responsable de una sala por su id
 * @param roomId, id de la sala a obtener.
 */
export function getRoom(roomId, callback) {
  Room.findOne({ id: roomId })
    .lean().exec(function(err, room) {
      if (err) {
        return callback({ status: 500, error: err })
      }

      if (room) {
        callback(null, {
          status: 200,
          data: {
            room: room
          }
        })
      } else {
        callback(null, {
          status: 404
        })
      }
    })
}

/**
 * Función responsable de una sala por su id
 * @param roomId, id de la sala a obtener.
 */
export function getRooms(callback) {
  Room.find({ roomType: 1,  $or: [{ status: 0 }, { status: 1 }] })
    .lean().exec(function(err, rooms) {
      if (err) {
        return callback({ status: 500, error: err })
      }

      if (rooms) {
        callback(null, {
          status: 200,
          data: {
            rooms: rooms
          }
        })
      } else {
        callback(null, {
          status: 404
        })
      }
    })
}
