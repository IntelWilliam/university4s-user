import React from 'react'
import loginUser from 'src/client/modules/Login/'
import LoginHeader from 'src/client/modules/layout/login-header'
import LoginFooter from 'src/client/modules/layout/login-footer'
import loading from 'src/client/modules/Chat/Modals/loading'
import {Link} from 'react-router'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      rememEmail: '',
      pageTexts: []
    }
  }

  componentWillMount(){
    this.loadPageTexts()
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("LOGIN", (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        console.log('body', body);
        // se setea el mensaje a mostrar
        this.setState({pageTexts: body.texts})
      }

    })
  }

  // cuendo está montado
  componentDidMount() {
    swal.close()
    $("#formlogin").validate({
      rules: {
        username: {
          required: true,
          minlength: 5
        },
        password: {
          required: true,
          minlength: 5
        },
        cpassword: {
          required: true,
          minlength: 5,
          equalTo: "#password"
        }
      },
      //For custom messages
      messages: {
        password: {
          required: "Ingrese su contraseña",
          minlength: "Ingrese al menos 5 caracteres"
        },
        username: {
          required: "Ingrese su nombre de usuario o email",
          minlength: "Ingrese al menos 5 caracteres"
        }

      },
      errorElement: 'div',
      errorPlacement: (error, element) => {
        var placement = $(element).data('error');
        if (placement) {
          $(placement).append(error)
        } else {
          error.insertAfter(element);
        }
      },
      submitHandler: this.handleSubmit.bind(this),
    })
    $('.close').click(() => {
      $('#card-alert').fadeOut("slow")
    })
  }

  // se recibe la accion de loguear
  handleSubmit() {
    // se capturan los datos del formulario
    var unindexed_array = $("#formlogin").serializeArray();
    // se crea un arreglo de los datos a actualizar
    var user = {};
    // se recorren los datos del formulario y se guardan en el formato correcto
    $.map(unindexed_array, function(n, i) {
      user[n['name']] = n['value']
    })

    let loadingNew = loading.replace(/text-to-load/g, this.state.pageTexts[5]);

    swal({
      html: loadingNew,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false
    })

    // espacio reservado para crear un usuario
    // console.log("user ", user);
    loginUser.login(user, (loggedIn) => {
      swal.close()
      if (!loggedIn) {
        // se muestra el mensaje de error
        $('#card-alert').fadeIn("slow")
        return
      }

      //activar la validacion de terminos y condiciones para los estudiantes
      if(loggedIn === "goTerms"){
      // if(false){
        this.context.router.replace('/validate-terms-conditions/')
      }else {
        const { location } = this.props
        if (location.state && location.state.nextPathname) {
          this.context.router.replace(location.state.nextPathname)
        } else {
          let saveUser = JSON.parse(localStorage.user)
          // console.log("saveUser", saveUser)
          if (saveUser.role == 'teacher') {
            this.context.router.replace('/user-area/video-chat/')
          } else {
            this.context.router.replace('/user-area/')
          }
        }

      }

    })

  }

  pressKeyNews(e){
    // console.log("key pres");
    if (e.keyCode == 13 && this.state.rememEmail) {
      // console.log("enter");
      this.subscribe()
    }
  }

  handleForm(event) {
    this.setState({rememEmail: event.target.value})
  }

  subscribe(){
    if(this.validateEmail(this.state.rememEmail)){

      // console.log("email", this.state.rememEmail);

      let loadingNew = loading.replace(/text-to-load/g, this.state.pageTexts[5]);

      swal({
        html: loadingNew,
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: false
      })

      var passRecovery = {};
      passRecovery['email'] = this.state.rememEmail;
      //email valido
      loginUser.recovery(passRecovery, (err, body) => {

        swal.close()

        // si llega un error
        if (err) {
          // console.log("error", err)
          swal({
            title: this.state.pageTexts[6],
            text: this.state.pageTexts[7],
            timer: 4000,
            showConfirmButton: false,
            type: 'warning'
          }).then(() => {}, (dismiss) => {
            this.setState({rememEmail: ''})
          })
        } else {
          console.log("body", body);
          // se a creado de forma exitosa
          // console.log("email registrado");
          swal({
            // title: 'Felicidades!',
            // text: 'Se ha enviado la contraseña a su correo.',
            title: this.state.pageTexts[8],
            text: this.state.pageTexts[9],
            type: 'info'
          }).then((event) => {
            this.setState({rememEmail: ''})
          })
        }

      })


    }else{
      // ingrese un email valido
      swal({
        title: this.state.pageTexts[6],
        text: this.state.pageTexts[7],
        // title: "Error.",
        // text: "Ingrese un Email valido!",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Continuar",
        type: "error",
      }).then(() => {
        this.setState({rememEmail: ''})
      })
    }
  }

  validateEmail(email) {
    var re = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
    return re.test(email);
  }


  render() {
    return (
      <div>
        <div style={{
          background: "#F6F7F7"
        }}>
        <LoginHeader/>
        <div className="col-xs-12 header-image-container calc100">
          <div className="row">
            <img className="bg-image-img home-blur" src="/images/elear.jpg" />
          </div>
          <div className="row height-full login-center calc100">
            <div className="container presentation-main presentation-main-login">
              <div className="col-xs-12">
                <div className="row end-xs">
                  <div className="col-xs-12 col-md-4 front">
                    <div className="card-login-form">
                      <div className="img-login">
                        <img className="login-profile" src="/images/profile.png"/>
                      </div>
                      <form className="login-form formValidate" id="formlogin">
                        <div className="row">
                          <div className="col-xs-12 center">
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-12">
                            <input id="username" className="rounded-component large-input"
                              name="username" placeholder="Nombre de usuario o E-mail" type="text" data-error=".errorTxt1" />
                              <div className="errorTxt1" ></div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-xs-12">
                              <input id="password" className="rounded-component large-input" name="password" placeholder="Contraseña" type="password" data-error=".errorTxt2" />
                              <div className="errorTxt2" ></div>
                            </div>
                          </div>
                          <div id="card-alert" className="card red" style={{display: 'none'}}>
                            <div>
                              <p>Revise la información suministrada</p>
                            </div>
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                              <span aria-hidden="true">×</span>
                            </button>
                          </div>
                          <div className="row">
                            <div className="col-xs-12">
                              <button className="rounded-component login-button input-submit" type="submit" name="action">{this.state.pageTexts[0]} </button>
                              {/* <button className="rounded-component login-button input-submit" type="submit" name="action">Ingresar </button> */}
                            </div>
                          </div>
                        </form>
                        <br></br><br></br>
                        <div className="login-form formValidate" id="formlogin">
                          <div className="row">
                            <div className="col-xs-12" style={{marginLeft: "0.7rem"}}>
                              <label>{this.state.pageTexts[1]}</label>
                              {/* <label>¿Olvidaste tu contraseña?</label> */}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-xs-12">
                              {/* <input  value={this.state.rememEmail || ''} onChange={this.handleForm.bind(this)} name="email" onKeyUp={this.pressKeyNews.bind(this)} className="rounded-component large-input" type="email" placeholder="Escribe tu E-mail" data-error=".errorTxt2" /> */}
                              <input  value={this.state.rememEmail || ''} onChange={this.handleForm.bind(this)} name="email" onKeyUp={this.pressKeyNews.bind(this)} className="rounded-component large-input" type="email" placeholder={this.state.pageTexts[2]} data-error=".errorTxt2" />
                            </div>
                          </div>
                          <div id="card-alert" style={{display: 'none'}}>
                            <div>
                              <p>ERROR : Revise la información suministrada</p>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-xs-12">
                              <button className="input-submit reset-button rounded-component" type="button" onClick={this.subscribe.bind(this)} name="action">{this.state.pageTexts[3]} </button>
                              {/* <button className="input-submit reset-button rounded-component" type="button" onClick={this.subscribe.bind(this)} name="action">Recordar </button> */}
                            </div>
                          </div>
                          <div className="row">
                            <Link  to="/newaccount/" className="col-xs-12">
                            {/* <p className="mousePoint" style={{'color': 'white'}} name="action">¿No tienes una cuenta? Crea una. </p> */}
                            <p className="mousePoint" style={{'color': 'black'}} name="action">{this.state.pageTexts[4]}</p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginFooter />

      </div>
    )
  }
}

Login.contextTypes = {
  router: React.PropTypes.object
}
export default Login
