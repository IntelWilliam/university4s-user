/**
 * Dependencias
 */
import { joinUser, assignCandidateTeacher, assignCall, getOnlineUsers, updateUserStatus, findUserBySocket, incTeacherStudents, decTeacherStudents } from 'src/server/lib/users'
import { joinRoom, leaveRoom, leaveRooms } from 'src/server/lib/rooms';
import { addChat } from 'src/server/lib/chats';
import { updateUserDate, addUserDate } from 'src/server/lib/reports'

/**
 * Módulo
 */
class users {
  constructor(io, socket) {
    this.socket = socket
    this.io = io
  }

  initEvents() {

    // se conecta alguien y lo guardo
    this.socket.on('AppConnected', (data, cb) => {

      console.log('data', data);
      this.socket.userData = data

      let userDate = {
        userId: data._id,
        userName: data.username ? data.username : data.name,
        userEmail: data.email ,
        userLastName: data.lastname
      }
      addUserDate(userDate, (err, resp) => {
        if (err) {
          return console.log(err);
        }
        this.socket.userDateId = resp._id;
      })

    })

    // onIceCandidate
    this.socket.on('candidate', (data) => {
      let toRoom
      if ('roomId' in data) {
        toRoom = data.roomId
      } else {
        toRoom = this.getRoomId(data.callTo, this.socket)
      }

      console.log("candidate data -> ", data);
      // emitimos el evento a los compañeros de sala
      this.socket.broadcast.to(toRoom).emit('candidate', data)
    })

    // onIceCandidate
    this.socket.on('candidateScreen', (data) => {
      let toRoom
      if ('roomId' in data) {
        toRoom = data.roomId
      } else {
        toRoom = this.getRoomId(data.callTo, this.socket)
      }
      // emitimos el evento a los compañeros de sala
      this.socket.broadcast.to(toRoom).emit('candidateScreen', data)
    })

    // changeTeacher
    this.socket.on('changeTeacher', (data) => {
      this.socket.broadcast.to(data.roomId).emit('changeTeacher', data)
    })

    // envio de mensaje
    this.socket.on('message', (data) => {
      addChat(data.chat)
      // emitimos el evento a los compañeros de sala
      this.socket.broadcast.to(data.roomId).emit('message', data)
    })

    // // Llamada perdida
    // this.socket.on('missedCall', () => {
    //   // emitimos el evento a los compañeros de sala
    //   this.socket.broadcast.to(data.roomId).emit('missedCall')
    // })

    // empieza un screenShare
    this.socket.on('studenShareScreen', (roomId) => {
      // emitimos el evento a los compañeros de sala
      this.socket.broadcast.to(roomId).emit('studenShareScreen')
    })

    // empieza un screenShare
    this.socket.on('renegotiateShareScreen', (roomId) => {
      // emitimos el evento a los compañeros de sala
      this.socket.broadcast.to(roomId).emit('renegotiateShareScreen')
    })

    // envio de mensaje
    this.socket.on('callTeacher', (data, toRoom) => {
      // emitimos el evento a los compañeros de sala
      let roomToCall = toRoom? toRoom : this.socket.room

      this.socket.broadcast.to(roomToCall).emit('studentCall', data)
    })

    // pregunta al profesor si esta en llamada
    this.socket.on('TeacherOnCall', (toRoom) => {
      let roomToCall = toRoom? toRoom : this.socket.room
      this.socket.broadcast.to(roomToCall).emit('TeacherOnCall', toRoom)
    })

    // profesor reponde si esta en llamada
    this.socket.on('teacherOnCallAnswer', (inCall, toRoom) => {
      let roomToCall = toRoom? toRoom : this.socket.room
      this.socket.broadcast.to(roomToCall).emit('teacherOnCallAnswer', inCall)
    })

    // envio de mensaje
    this.socket.on('userCancelCall', (data, toRoom) => {
      // emitimos el evento a los compañeros de sala
      let roomTo = toRoom? toRoom : this.socket.room
      this.socket.broadcast.to(roomTo).emit('teacherCancelCall', data)
    })

    // envio de mensaje
    this.socket.on('acceptCall', (data) => {
      // emitimos el evento a los compañeros de sala
      this.socket.broadcast.to(data.roomId).emit('teacherAcceptCall', data)
    })

    // cuando el tutor pausa la llamada
    this.socket.on('pauseCall', (data) => {
      console.log('pauseCall', data);
      this.socket.broadcast.to(data.roomId).emit('pauseCall', data)
    })

    // cuando el tutor continua la llamada
    this.socket.on('resumeCall', (data, toRoom) => {
      // emitimos el evento a los compañeros de sala
      let roomToCall = toRoom? toRoom : this.socket.room

      this.socket.broadcast.to(roomToCall).emit('resumeCall', data)
    })

    // evento para remover audio
    this.socket.on('removeAudio', (data) => {
      // emitimos el evento a los compañeros de sala
      this.socket.broadcast.to(data.roomId).emit('removeAudio', data)
    })

    // evento para remover audio
    this.socket.on('removeVideo', (data) => {
      // emitimos el evento a los compañeros de sala
      this.socket.broadcast.to(data.roomId).emit('removeVideo', data)
    })

    this.socket.on('assignToTeacher', (data) => {
      let student = data.student
      let teacher = data.teacher
      let users = []

        users.push(teacher, student)
        // Se crea una sala para los 2 que entraron en videollamada
        joinRoom(users, 1, (error, response) => {
          if (error) {
            console.log(error.err);
          } else {
            // si ya se encuentra en una sala
            this.validateRoomData(this.socket, response.data.room.id);
            if (teacher.socket.id in this.io.sockets.connected) {
              // se emite al profesor que se creo un room con el proposito que se una
              this.io.sockets.connected[teacher.socket.id].emit('roomCreated', {
                roomId: response.data.room.id,
                student: student,
                makeNotify: true
              })
            } else {
              return this.io.sockets.connected[this.socket.id].emit('noTeacher')
            }

          }
        })
    })

    // un estudiante busca un profesor disponible
    this.socket.on('findTeacher', (student) => {
      let users = []
      // se le asigna un profesor al estudiante
      this.assignClosestTeacher((err, teacher) => {
        if (err) return this.io.sockets.connected[this.socket.id].emit('noTeacher')

        users.push(teacher, student)
        // Se crea una sala para los 2 que entraron en videollamada
        joinRoom(users, 1, (error, response) => {
          if (error) {
            console.log(error.err);
          } else {
            // si ya se encuentra en una sala
            this.validateRoomData(this.socket, response.data.room.id);
            if (teacher.socket.id in this.io.sockets.connected) {
              // se emite al profesor que se creo un room con el proposito que se una
              this.io.sockets.connected[teacher.socket.id].emit('roomCreated', {
                roomId: response.data.room.id,
                student: student
              })
            } else {
              return this.io.sockets.connected[this.socket.id].emit('noTeacher')
            }

          }
        })
      })
    })

    this.socket.on('adminCall', (data) => {
      // se crea un arreglo con los usuarios que van a estar en el room
      let users = [];
      findUserBySocket(data.socketId, (error, teacherResponse) => {
        if (error) {
          return this.io.sockets.connected[this.socket.id].emit('noUser', data.callTo)
        } else {
          findUserBySocket(this.socket.id, (err, adminResponse) => {
            if (err) {
              return this.io.sockets.connected[this.socket.id].emit('noUser', data.callTo)
            } else {
              users.push(teacherResponse.data.user, adminResponse.data.user);

              // Se crea una sala para los 2 que entraron en videollamada
              joinRoom(users, 2, (error, response) => {
                if (error) {
                  console.log(error.err);
                } else {
                  this.validateAdminRoomData(this.socket, response.data.room.id, data.callTo);

                  // se emite al profesor o estudiante que se creo un room con el proposito que se una
                  this.io.sockets.connected[data.socketId].emit('adminRoomCreated', { roomId: response.data.room.id, callTo: data.callTo })
                }
              })
            }
          });
        }
      });
    })

    // alguien se une a un room
    this.socket.on('joinToRoom', (data) => {
      incTeacherStudents(data.teacher._id, 1)
      // si ya se encuentra en una sala
      this.validateTeacherRoomData(this.socket, data.roomId);
      // emitimos el evento de que el room está listo
      this.socket.broadcast.to(data.roomId).emit('roomReady', data)
      this.socket.broadcast.emit('roomsChange');
    })

    // alguien se une a un room del admin
    this.socket.on('joinToAdminRoom', (data) => {
      // si ya se encuentra en una sala
      this.validateAdminRoomData(this.socket, data.roomId, data.callTo);
      // emitimos el evento de que el room está listo
      this.socket.broadcast.to(data.roomId).emit('roomAdminReady', data)
    })

    // hacen una oferta
    this.socket.on('offer', (data) => {
      var toRoom = this.getRoomId(data.callTo, this.socket)
      // emitimos el evento a los compañeros de sala
      this.socket.broadcast.to(toRoom).emit('offer', data)
    })


    // se envia el usuario pausado al profesor
    this.socket.on('pausedStudent', (data) => {
      var toRoom
      if ('roomId' in data) {
        toRoom = data.roomId
      } else {
        toRoom = this.getRoomId(data.callTo, this.socket)
      }
      // emitimos el evento a los compañeros de sala
      this.socket.broadcast.to(toRoom).emit('pausedStudent', data)
    })

    // hacen una oferta
    this.socket.on('offerScreen', (data) => {
      var toRoom = this.getRoomId(data.callTo, this.socket)
      // emitimos el evento a los compañeros de sala
      this.socket.broadcast.to(toRoom).emit('offerScreen', data)
    })

    // dan una respuesta
    this.socket.on('answer', (data) => {
      var toRoom
      if ('roomId' in data) {
        toRoom = data.roomId
      } else {
        toRoom = this.getRoomId(data.callTo, this.socket)
      }
      // emitimos el evento a los compañeros de sala
      this.socket.broadcast.to(toRoom).emit('answer', data)
    })

    // dan una respuesta
    this.socket.on('answerScreen', (data) => {
      if ('roomId' in data) {
        var toRoom = data.roomId
      } else {
        var toRoom = this.getRoomId(data.callTo, this.socket)
      }
      // emitimos el evento a los compañeros de sala
      this.socket.broadcast.to(toRoom).emit('answerScreen', data)
    })

    // se conecta alguien y lo guardo
    this.socket.on('join', (data, cb) => {

      // registro de conexion al chat
      let userDate = {
        userId: data._id,
        userName: data.username ? data.username : data.name,
        isChat: true
      }
      addUserDate(userDate, (err, resp) => {
        if (err) {
          return console.log(err);
        }
        this.socket.userDateId = resp._id;
      })

      this.socket.socketRole = data.role

      //guardo el source para saber si viene del chat o de App
      this.socket.socketSource = data.source
      joinUser(data, this.socket.id, (err, response) => {
        if (err) return cb(err)
        this.socket.broadcast.emit('joined', response.data.user.name + ' ' + response.data.user.lastname)
        if (response.data.user.role == 'teacher') {
          this.socket.broadcast.emit('teachersChange')
        }
        cb(null, response.data.user)
      })
    })

    // se conecta alguien y lo guardo
    this.socket.on('endCall', (data) => {
      // emitimos el evento a los compañeros de sala
      this.socket.broadcast.to(data.roomId).emit('endCall', data)
    })

    // se conecta alguien y lo guardo
    this.socket.on('endCallScreen', (roomId) => {
      // emitimos el evento a los compañeros de sala
      this.socket.broadcast.to(roomId).emit('endCallScreen')
    })

    // se conecta alguien y lo guardo
    this.socket.on('endAdminCall', () => {
      // se devuelven los estados de los participantes
      this.normalizeAdminRoomState(this.socket.id, this.socket.teacherRoom, this.socket.studentRoom, 1)

      if (this.socket.teacherRoom) {
        // emitimos el evento a los compañeros de sala
        this.socket.broadcast.to(this.socket.teacherRoom).emit('endAdminCall')
      }

      if (this.socket.studentRoom) {
        // emitimos el evento a los compañeros de sala
        this.socket.broadcast.to(this.socket.studentRoom).emit('endAdminCall')
      }

    })


    // cuando un profesor cambia a un estudiante a otro profesor
    this.socket.on('leaveToChange', (data) => {
      if(this.socket.socketSource == 'video-chat'){

        console.log('data', data);

        if(data.prevTeacher){
          console.log('data.prevTeacher', data.prevTeacher);
          decTeacherStudents(data.prevTeacher._id, 1)
        }

          // se actualiza el estado a 0 que es desconectado
          this.normalizeState(this.socket.id, this.socket.room, 0)
          // si estaba en una sala
          if (this.socket.room) {
            // emitimos el evento a los compañeros de sala
            this.socket.broadcast.to(this.socket.room).emit('userLeave', this.socket.room)
          }

          // si estaba en una sala
          if (this.socket.teacherRoom) {
            // emitimos el evento a los compañeros de sala
            this.socket.broadcast.to(this.socket.teacherRoom).emit('endAdminCall')
          } else if (this.socket.studentRoom) {
            // emitimos el evento a los compañeros de sala
            this.socket.broadcast.to(this.socket.studentRoom).emit('endAdminCall')
          }
        }
    })


    // evento que se dispara cuando un usuario se desconecta
    this.socket.on('disconnect', () => {
      if(this.socket.socketSource == 'video-chat'){

          if (this.socket.socketRole == 'admin') {
            // se devuelven los estados de los participantes
            this.normalizeAdminRoomState(this.socket.id, this.socket.teacherRoom, this.socket.studentRoom, 0)
          } else if (this.socket.socketRole == 'teacher') {
            // se actualiza el estado a 0 que es desconectado
            this.normalizeState(this.socket.id, null, 0, true)
            // emito el evento que se fue un profesor
            this.socket.broadcast.emit('teacherLeave', this.socket.id)
          } else {
            // se actualiza el estado a 0 que es desconectado
            this.normalizeState(this.socket.id, this.socket.room, 0)
            // si estaba en una sala
            if (this.socket.room) {
              // emitimos el evento a los compañeros de sala
              this.socket.broadcast.to(this.socket.room).emit('userLeave', this.socket.room)
            }
          }
          // si estaba en una sala
          if (this.socket.teacherRoom) {
            // emitimos el evento a los compañeros de sala
            this.socket.broadcast.to(this.socket.teacherRoom).emit('endAdminCall')
          } else if (this.socket.studentRoom) {
            // emitimos el evento a los compañeros de sala
            this.socket.broadcast.to(this.socket.studentRoom).emit('endAdminCall')
          }
          this.socket.broadcast.emit('userDisconnected')

        }

          let newData = {
            GetOutDate: new Date()
          }

          updateUserDate(this.socket.userDateId, newData, (err, resp) => {
            if (err) {
              return console.log(err);
            }

          })


    });


    // cuando una llaada es rechazada
    this.socket.on('CancelledCall', (roomId) => {
      // se eliminan los rooms
      this.normalizeState(this.socket.id, roomId, 1)
      this.socket.broadcast.to(roomId).emit('CancelledCall', roomId)
    })

    // cuando el tutor esta en otra llamada
    this.socket.on('BusyCall', (roomId) => {
      // se eliminan los rooms
      this.normalizeState(this.socket.id, roomId, 1)
      this.socket.broadcast.to(roomId).emit('BusyCall', roomId)
    })

    // cuando se recibe el contenido del tablero
    this.socket.on('boardContent', (content, roomId) => {
      // se envia el mensaje a los que estan conectados a la room
      this.socket.broadcast.to(roomId).emit('boardContentReceive', content)
    })

    this.socket.on('boardShareState', (state, roomId) => {
      // se envia el mensaje a los que estan conectados a la room
      this.socket.broadcast.to(roomId).emit('onBoardShareState', state)
    })

  }

  getRoomId(callTo, socket) {
    return callTo == "peer" ? socket.room : (callTo == "teacher" ? socket.teacherRoom : socket.studentRoom)
  }

  // funcion encargada de asignar un profesor candidato a los estudiantes dados
  assignClosestTeacher(cb) {
    assignCandidateTeacher((err, data) => {
      if (err) return cb(err)
      // se valida que venga data ya que puede que no haya profesores disponibles
      if (data.data && data.data.user) return cb(null, data.data.user)
      return cb({ err: "no hay disponibles" })
    })
  }

  normalizeState(socketId, roomId, firstStatus, isTeacher) {
    // se cambia el estado del que abandona la sala
    updateUserStatus(socketId, firstStatus, (err, response) => {
      // si es un profesor se emite el evento de actualizar lista de profesores
      if (!err && isTeacher) {
        this.socket.broadcast.emit('teachersChange')
      }
    })
    // si viene un room se elimina el room y se cambia el estado de los que estaban en el room
    if (roomId) {
      leaveRoom(roomId, (err, response) => {
        if (err) {
          console.log("error", err);
        } else if (response.status == 204) {
          let activeUser = response.data.room.users.find((user) => {
            return user.socket.id != socketId;
          })
          // se restan los que está atendiendo un profesor
          incTeacherStudents(activeUser._id, -1)
        }
        this.socket.broadcast.emit('roomsChange')
      })
    } else if (isTeacher) {
      leaveRooms(socketId)
    }
  }

  normalizeAdminRoomState(socketId, teacherRoomId, studentRoomId, firstStatus) {
    // se cambia el estado del que abandona la sala
    updateUserStatus(socketId, firstStatus, (err, response) => { })
    if (teacherRoomId) {
      leaveRoom(teacherRoomId, (err, response) => { })
    }

    if (studentRoomId) {
      leaveRoom(studentRoomId, (err, response) => { })
    }
  }

  validateRoomData(socket, roomId) {
    // si ya se encuentra en una sala
    if (socket.room) {
      // si la nueva sala es diferente a la sala que tenia
      if (socket.room != roomId) {
        // se abandona la sala antigua
        socket.leave(socket.room)
        // guardamos la variable room en el socket de usuario que se une
        socket.room = roomId
        // se une el usuario a la nueva sala
        socket.join(roomId)
      }
    } else {
      // guardamos la variable room en el socket de usuario que se une
      socket.room = roomId
      // se une el usuario a la sala
      socket.join(roomId)
    }
  }

  validateTeacherRoomData(socket, roomId) {
    // si ya se encuentra en una sala
    if (!socket[roomId]) {
      // guardamos la variable room en el socket de usuario que se une
      socket[roomId] = roomId
      // se une el usuario a la sala
      socket.join(roomId)
    }
  }

  validateAdminRoomData(socket, roomId, callTo) {
    // nombre de la variable que se busca en el socket
    var roomSpace = callTo == 'teacher' ? 'teacherRoom' : 'studentRoom'
    // si ya se encuentra en una sala
    if (socket[roomSpace]) {
      // si la nueva sala es diferente a la sala que tenia
      if (socket[roomSpace] != roomId) {
        // se abandona la sala antigua
        socket.leave(socket[roomSpace])
        // guardamos la variable room en el socket de usuario que se une
        socket[roomSpace] = roomId
        // se une el usuario a la nueva sala
        socket.join(roomId)
      }
    } else {
      // guardamos la variable room en el socket de usuario que se une
      socket[roomSpace] = roomId
      // se une el usuario a la sala
      socket.join(roomId)
    }
  }

}

export default users
