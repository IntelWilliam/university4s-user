/**
 *   Dependencias
 */
import Io from 'socket.io'
import users from 'src/server/sockets'

/**
 *   Socket.io
 */
class SocketIO {
  constructor(config) {
    this.config = config || {}
    this.io = Io.listen(config.server)
  }

  initSocket() {
    this.io.sockets.on('connection', (socket) => {
      // console.log('user connected')
      this.usersEvents = new users(this.io, socket)
        // se llama la funcion que inicia los eventos de usuario
      this.usersEvents.initEvents()

    })
  }
}

// Exports
export default SocketIO
