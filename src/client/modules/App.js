import React from 'react'
import Header from 'src/client/modules/layout/header'
import loginUser from 'src/client/modules/Login/'
import io from 'socket.io-client'

class App extends React.Component {
  constructor() {
    super();
    // se envia el this a la funcion updateAuth para acceder a los atributos de la clase desde esta funcion
    this.updateAuth = this.updateAuth.bind(this)
  }

  updateAuth(loggedIn) {
    // si el cambio es negativo se desloguea
    if (!loggedIn) {
      this.context.router.replace('/login')
    }
  }
  componentWillMount() {
    loginUser.onChange = this.updateAuth

    let user = JSON.parse(localStorage.user)
    this.socket = io()

    this.socket.emit('AppConnected', user, (err, user) => {
      console.log("err", err)
      if (err) return swal("error de red")
      // console.log('user', user);

    })
  }

  componentWillUnmount() {
    this.socket.disconnect()
  }

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    )
  }
}

App.contextTypes = {
  router: React.PropTypes.object
}

export default App
