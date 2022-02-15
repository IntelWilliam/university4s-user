import React from 'react'
// import {Link} from 'react-router'
// import Constants from 'src/client/Constants/Constants'
import accountStore from 'src/client/modules/Moodle/Account/AccountStore'


class EditPassword extends React.Component {
  constructor() {
    super()
    this.state = {
      userData: [],
    }
  }

  componentDidMount() {
    $("#formlogin").validate({
      rules: {
        password: {
          required: true,
          minlength: 5
        },
        newPass1: {
          required: true,
          minlength: 5
        },
        newPass2: {
          required: true,
          minlength: 5,
          equalTo: "#newPass1"
        }
      },
      //For custom messages
      messages: {
        password: {
          required: "Ingrese su contraseña",
          minlength: "Ingrese al menos 5 caracteres"
        },
        newPass1: {
          required: "Ingrese la nueva contraseña",
          minlength: "Ingrese al menos 5 caracteres"
        },
        newPass2: {
          required: "Ingrese la nueva contraseña",
          minlength: "Ingrese al menos 5 caracteres",
          equalTo: "Las contraseñas deben coincidir"
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

  componentWillMount() {
    this.loadData()
  }

  loadData() {
    accountStore.getOne(JSON.parse(localStorage.user)._id, (err, response) => {
      if (err)
      return
      // se cambia el estado allLessons con los nuevos usuarios
      this.setState({userData: response.data[0]})
    })
  }

  // se recibe la accion de loguear
  handleSubmit() {
    // se capturan los datos del formulario
    var unindexed_array = $("#formlogin").serializeArray();
    // se crea un arreglo de los datos a actualizar
    var user = {};
    // se recorren los datos del formulario y se guardan en el formato correcto
    $.map(unindexed_array, function(n) {
      user[n['name']] = n['value']
    })

    if (user.newPass1 == user.newPass2){

      let data = {};
      data.userEmail = this.state.userData.email;
      data.currentPass = user.password;
      data.newPass = user.newPass2;

      // se llama la accion que actualiza un usuario
      accountStore.updatePass(data, (err, response) => {
        // si llega un error
        if (err) {
          swal({
            type: "warning",
            title: "Error.",
            text: this.props.pageTexts[43],
            // text: "Datos Incorrectos!",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: this.props.pageTexts[44]
            // confirmButtonText: "Continuar"
          }).then(() => {
            this.context.router.push('/user-area/')
          })

        } else {
          // se setea el mensaje a mostrar
          // console.log('response', response);
          swal({
            title: this.props.pageTexts[45],
            text: this.props.pageTexts[46],
            // title: "Contraseña actualizada.",
            // text: "Su contraseña ha sido actualizada con éxito!",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: this.props.pageTexts[47]
            // confirmButtonText: "Continuar"
          }).then(() => {
            this.context.router.push('/user-area/')
          })

        }
      })

    }
  }

  reset() {

  }


  render() {
    return (
      <form className="login-form formValidate account-login-form" id="formlogin">

        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12">
              <div className="info-title-section-container" style={{
                marginTop: "2em"
              }}>
              <div className="pdf-icon-container">
                <img className="pdf-icon" src="/images/candadonegro.png"/>
              </div>
              <div className="info-title-container">
                <span className="info-title">{this.props.pageTexts[32]}</span>
                {/* <span className="info-title">Cambiar contraseña</span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xs-12">
        <div className="row">
          <div className="col-xs-12">
            <div className="exercise-border">
              <span>&nbsp;</span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xs-12 learner-data-container">
        <div className="row">
          <div className="col-xs-12">
            <div className="row">
              <div className="col-xs-12 col-sm-6 account-container">
                <div className="row">
                  <div className="col-xs-6 account-input-text-container">
                    <span className="bold account-input-text">{this.props.pageTexts[33]}
                      {/* <span className="bold account-input-text">Contraseña actual */}
                      <span style={{
                        color: 'red'
                      }}>
                      &nbsp;*</span>
                    </span>
                  </div>
                  <div className="col-xs-6 input-flex">
                    <input id="password" name="password" className="account-input" type="password" data-error=".errorTxt1" autoComplete="off"></input>
                  </div>
                  <div className="col-xs-6 col-xs-offset-6 errorTxt1"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xs-12">
            <div className="row">
              <div className="col-xs-12 col-sm-6 account-container">
                <div className="row">
                  <div className="col-xs-6 account-input-text-container">
                    <span className="bold account-input-text">{this.props.pageTexts[34]}
                      {/* <span className="bold account-input-text">Nueva contraseña */}
                      <span style={{
                        color: 'red'
                      }}>
                      &nbsp;*</span>
                    </span>
                  </div>
                  <div className="col-xs-6 input-flex">
                    <input id="newPass1" name="newPass1" className="account-input" type="password" data-error=".errorTxt2" autoComplete="off"></input>
                  </div>
                  <div className="col-xs-6 col-xs-offset-6 errorTxt2" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-xs-12">
            <div className="row">
              <div className="col-xs-12 col-sm-6 account-container">
                <div className="row">
                  <div className="col-xs-6 account-input-text-container">
                    <span className="bold account-input-text">{this.props.pageTexts[35]}
                      {/* <span className="bold account-input-text">Confirmar nueva contraseña */}
                      <span style={{
                        color: 'red'
                      }}>
                      &nbsp;*</span>
                    </span>
                  </div>
                  <div className="col-xs-6 input-flex">
                    <input id="newPass2" name="newPass2" className="account-input" type="password" data-error=".errorTxt3" autoComplete="off"></input>
                  </div>
                  <div className="col-xs-6 col-xs-offset-6 errorTxt3" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="col-xs-12 section-name">
        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12 action-container">
              {/* <button className="account-button mousePoint">Actualizar</button> */}
              <button className="account-button mousePoint" type="submit">{this.props.pageTexts[30]}</button>
              <button className="account-button red-button   mousePoint" type="reset">{this.props.pageTexts[31]}</button>
              {/* <button className="account-button mousePoint" type="submit">Actualizar</button>
              <button className="account-button red-button   mousePoint" type="reset">Limpiar</button> */}
            </div>
          </div>
        </div>
      </div>

    </form>

  )
}
}
EditPassword.contextTypes = {
  router: React.PropTypes.object
}


export default EditPassword
