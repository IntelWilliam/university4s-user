import Constants from 'src/client/Constants/Constants'

/*
+ Esta clase permite controlar los eventos de login
*/
class loginUser {

  recovery(emai, callback) {
    console.log('emai', emai);
    $.post(Constants.API_LINK + 'pass-recovery/', emai, (body) => {
      // si no es error se responde con el body que envia el server
      callback(null, body)

    }).fail((err) => {
      console.log("error loginUser.recovery");
      callback(err)
    })
  }

  // metodo para verificar si el usuario está logueado
  login(user, cb) {
    // se hace la petición para loguear al usuario
    this.loginRequest(user, (err, res) => {
      // si viene error es porque no se pudo loguear
      if (err) {
        delete localStorage.logged
        this.onChange(false)
        // se retorna falso
        cb(false)
      } else {
        // si entrá aqui es porque se logueo exitosamente
        localStorage.logged = true
        // se guardan los datos del usuario en local
        localStorage.user = JSON.stringify(res)
        // se emite evento que se logueo
        this.onChange(true)
        // se retorna true

        let user = JSON.parse(localStorage.user)
        console.log("user", user);
        if (!user.acceptTerms && user.role != 'teacher') {
          cb("goTerms")
        } else {
          cb(true)
        }
      }
    })
  }

  // se desloguea al usuario
  logout(cb) {
    // se hace la petición para loguear al usuario
    this.logoutRequest((err, res) => {
      // se elimina la variable de sesión
      delete localStorage.logged
      // se elimina los datos del usuario
      delete localStorage.user
      // se emite el evento
      this.onChange(false)
      // se emite el callback
      cb('logout')
    })

  }

  // se loguea al usuario
  loggedIn() {
    return !!localStorage.logged
  }

  acceptTerms() {
    let user = JSON.parse(localStorage.user)
    return !!user.acceptTerms || user.role == "teacher"
  }

  // se emite un evento
  onChange() {
  }

  // peticion para lguear
  loginRequest(user, cb) {
    // se hace el post para iniciar session
    $.ajax({
      // method: "POST",
      // url: Constants.LOG_IN_LINK + 'login/',
      // data: user,
      method: "POST",
      url: Constants.LOG_IN_LINK + 'loginlearnerDev/',
      xhrFields: {
        withCredentials: true
      },
      data: user,
    })
      .done(function (body) {
        cb(null, body)
      }).fail((err) => {
        console.log('err', err)
        // si falla la peticion se envia el error
        cb(err)
      });
  }

  //   // peticion para lguear
  // loginRequest(user, cb) {
  //   // se hace el post para iniciar session
  //   $.ajax({
  //     // method: "POST",
  //     // url: Constants.LOG_IN_LINK + 'login/',
  //     // data: user,
  //     method: "POST",
  //     url: 'https://re-bilingual.com/loginlearnerDev/',
  //     xhrFields: {
  //       withCredentials: true
  //     },
  //     data: user,
  //   })
  //     .done(function (body) {
  //       cb(null, body)
  //     }).fail((err) => {
  //       console.log('err', err)
  //       // si falla la peticion se envia el error
  //       cb(err)
  //     });
  // }

  // peticion para lguear
  logoutRequest(cb) {
    // se hace el post para iniciar session
    $.get(Constants.LOG_IN_LINK + 'logoutuser/', (body) => {

      if (this.context)
        this.context.router.replace('/login')

      cb(null, body)

    }).fail((err) => {
      // si falla la peticion se envia el error
      cb(err)
    })
  }
}

// se instancia la clase
let loginUserInstance = new loginUser()
// se exporta la instancia
export default loginUserInstance
